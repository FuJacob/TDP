// apps/backend/src/controllers/us-008/bids.controller.ts
import { Request, Response } from 'express';
import * as bidService from '../../services/bid.service';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Initialize Supabase client for notifications endpoint
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email notifications with retries
const sendEmail = async (
  recipient: string,
  subject: string,
  message: string,
  retries = 3
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject,
      text: message,
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

/**
 * GET /api/v1/bids
 * Fetch all bids for the logged-in user, with pagination and optional filters.
 */
export async function getBidsHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Use req.user.email as the identifier (or req.user.userId if available)
    const userId = req.user.email;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort_by = (req.query.sort_by as string) || 'last_updated';
    const filters = {
      bid_status: req.query.bid_status as string | undefined,
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

/**
 * GET /api/v1/bids/:id
 * Fetch a single bid by its ID (only if it belongs to the logged-in user).
 */
export async function getSingleBidHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.email;
    const { id } = req.params;
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

/**
 * PATCH /api/v1/bids/:id
 * Update the bid status (or other fields) for a given bid.
 * After updating, it emits a WebSocket event for real-time updates.
 */
export async function updateBidStatusHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.email;
    const { id } = req.params;
    const { newStatus } = req.body;
    if (!newStatus) {
      return res.status(400).json({ error: 'newStatus is required' });
    }
    const updatedBid = await bidService.updateBidStatus(userId, id, newStatus);
    if (!updatedBid) {
      return res.status(404).json({ error: 'Bid not found or not updated' });
    }

    // Emit the update via WebSocket if available
    const io = req.app.get('io');
    if (io) {
      io.emit('bidStatusUpdated', { bid: updatedBid });
    }

    return res.json({ bid: updatedBid });
  } catch (err: any) {
    console.error('Error updating bid status:', err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/v1/bids/send-notifications
 * Fetch bid statuses from the submitted_bids table and send email notifications based on their status.
 */
export async function sendBidNotificationsHandler(req: Request, res: Response) {
  try {
    // Adjust table name to 'submitted_bids'
    const { data, error } = await supabase.from('submitted_bids').select('*');
    if (error) throw error;

    // Iterate over each bid and send notifications based on status
    for (const bid of data) {
      // Adjust field names as per your schema. Here we assume:
      // bid.email, bid.tender_name, bid.bid_status, and bid.rejection_reason exist.
      const recipient = bid.email;
      const tenderName = bid.tender_name || 'your tender';
      const status = bid.bid_status;
      const rejectionReason = bid.rejection_reason || '';

      let subject = '';
      let message = '';

      switch (status) {
        case 'accepted':
          subject = 'Bid Accepted';
          message = `Congratulations! Your bid for ${tenderName} has been accepted.\nView details: http://example.com/bid/${tenderName}`;
          break;
        case 'rejected':
          subject = 'Bid Rejected';
          message = `Your bid for ${tenderName} was not selected.\nReason: ${rejectionReason}\nView details: http://example.com/bid/${tenderName}`;
          break;
        case 'awarded':
          subject = 'Bid Awarded';
          message = `You have won the bid for ${tenderName}!\nView details: http://example.com/bid/${tenderName}`;
          break;
        default:
          console.warn(`Invalid status for bid ID ${bid.bid_id}`);
          continue;
      }

      await sendEmail(recipient, subject, message);
    }

    return res.json({ message: 'Notifications sent successfully' });
  } catch (error: any) {
    console.error('Error sending bid notifications:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
