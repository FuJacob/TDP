// apps/backend/src/routes/bid.routes.ts
import { Router } from 'express';
import {
  getBidsHandler,
  getSingleBidHandler,
  updateBidStatusHandler,
} from '../controllers/us-008/bids.controller';

const bidRouter = Router();

// GET /api/v1/bids? page, limit, sort_by, bid_status, etc.
bidRouter.get('/', getBidsHandler);

// GET /api/v1/bids/:id
bidRouter.get('/:id', getSingleBidHandler);

// PATCH /api/v1/bids/:id -> update bid status or other fields
bidRouter.patch('/:id', updateBidStatusHandler);

export default bidRouter;
