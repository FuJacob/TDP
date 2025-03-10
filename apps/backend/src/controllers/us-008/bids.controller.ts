// apps/backend/src/controllers/us-008/bids.controller.ts
import { Request, Response } from 'express';
import * as bidService from '../../../services/bid.service';

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

