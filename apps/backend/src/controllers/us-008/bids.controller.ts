// apps/backend/src/controllers/us-008/bids.controller.ts
import express, { Request, Response } from 'express';
import * as bidService from '../../../services/bid.service';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';


dotenv.config();

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

// Configure Supabase client
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Function to send email notifications
const sendEmail = async (recipient: string, subject: string, message: string, retries = 3): Promise<void> => {
  try {
      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: recipient,
          subject,
          text: message
      });
      console.log(`Email sent to ${recipient}: ${subject}`);
  } catch (error) {
      console.error(`Email sending failed: ${error}`);
      if (retries > 0) {
          console.log(`Retrying... (${retries} attempts left)`);
          await sendEmail(recipient, subject, message, retries - 1);
      }
  }
};


export async function getBidsHandler(req: Request, res: Response) {
  try {
    // We expect auth.middleware to set req.user. If not, user is undefined
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.email; 
    // or req.user.userId if your JWT sets that
    // Just be consistent with how you store the user’s ID in the JWT

    // Parse pagination & filters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort_by = (req.query.sort_by as string) || 'last_updated';

    // Example filter: ?bid_status=Submitted
    const filters = {
      bid_status: req.query.bid_status as string | undefined,
      // add more if needed
    };

    const { bids, pagination } = await bidService.getBidsForUser(userId, {
      page,
      limit,
      sort_by,
      filters,
    });

    return res.json({ bids, pagination });
  } catch (err: any) {
    console.error('Error fetching bids:', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getSingleBidHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.email; 
    // or req.user.userId if your JWT sets that

    const { id } = req.params; // /api/v1/bids/:id
    const bid = await bidService.getBidById(userId, id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    return res.json({ bid });
  } catch (err: any) {
    console.error('Error fetching single bid:', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function updateBidStatusHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.email; 
    // or req.user.userId

    const { id } = req.params;
    const { newStatus } = req.body;
    if (!newStatus) {
      return res.status(400).json({ error: 'newStatus is required' });
    }

    const updatedBid = await bidService.updateBidStatus(userId, id, newStatus);
    if (!updatedBid) {
      return res.status(404).json({ error: 'Bid not found or not updated' });
    }

    // Real-time broadcast (if using websockets)
    // e.g. req.io.emit('bidStatusUpdated', { bid: updatedBid });

    return res.json({ bid: updatedBid });
  } catch (err: any) {
    console.error('Error updating bid status:', err);
    return res.status(500).json({ error: err.message });
  }
}



// API route to fetch bid status from Supabase and send email notifications
app.get('/send-bid-notifications', async (req: Request, res: Response) => {
    try {
        // Fetch bid statuses from Supabase
        const { data, error } = await supabase.from('bids').select('*');
        if (error) throw error;

        for (const bid of data) {
            const { email, tender_name, status, rejection_reason } = bid;
            let subject = '';
            let message = '';

            switch (status) {
                case 'accepted':
                    subject = 'Bid Accepted';
                    message = `Congratulations! Your bid for ${tender_name} has been accepted.\nView details: http://example.com/bid/${tender_name}`;
                    break;
                case 'rejected':
                    subject = 'Bid Rejected';
                    message = `Your bid for ${tender_name} was not selected.\nReason: ${rejection_reason}\nView details: http://example.com/bid/${tender_name}`;
                    break;
                case 'awarded':
                    subject = 'Bid Awarded';
                    message = `You have won the bid for ${tender_name}!\nView details: http://example.com/bid/${tender_name}`;
                    break;
                default:
                    console.warn(`Invalid status for bid ID ${bid.id}`);
                    continue;
            }

            await sendEmail(email, subject, message);
        }

        res.json({ message: 'Notifications sent successfully' });
    } catch (error) {
        console.error('Error fetching bid data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });