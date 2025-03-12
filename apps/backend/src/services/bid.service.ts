// apps/backend/src/services/bid.service.ts
import { createSupabaseClient } from '../utils/createSupabaseClient';
interface BidQueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  filters?: Record<string, string | undefined>;
}

// Basic shape of a row in submitted_bids
export interface SubmittedBid {
  bid_id: string;       // UUID
  bid_title: string | null;
  last_updated: string | null;
  action_avail: boolean | null;
  tender_ref: string | null; // foreign key to tenders
  user_id: string | null;    // references user ID
  user_name: string | null;
  submission_dt: string | null;
  bid_status: string | null;
}

// Pagination + Data
export interface BidSearchResult {
  bids: SubmittedBid[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

//Fetching bids for a user
export async function getBidsForUser(
  userId: string,
  queryParams: BidQueryParams
): Promise<BidSearchResult> {
  const { page = 1, limit = 10, sort_by = 'last_updated', filters = {} } = queryParams;
  const offset = (page - 1) * limit;

  let dbQuery = supabase
    .from('submitted_bids')
    .select('*', { count: 'exact' })
    .eq('user_id', userId) // only fetch bids for this user
    .range(offset, offset + limit - 1);

  // Optional filters
  for (const key in filters) {
    if (filters[key]) {
      // Simple eq filter. Extend if you want ilike or more advanced filtering
      dbQuery = dbQuery.eq(key, filters[key]);
    }
  }

  // Sort by column, default last_updated descending
  const ascending = false; 
  dbQuery = dbQuery.order(sort_by, { ascending });

  const { data, error, count } = await dbQuery;

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    bids: data as SubmittedBid[],
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

//Fetching a singular bid through its bid ID
export async function getBidById(userId: string, bidId: string): Promise<SubmittedBid | null> {
  const { data, error } = await supabase
    .from('submitted_bids')
    .select('*')
    .eq('user_id', userId)
    .eq('bid_id', bidId)
    .single(); // fetch exactly one row

  if (error) {
    if (error.code === 'PGRST116') {
      // Row not found
      return null;
    }
    throw new Error(`Failed to fetch bid: ${error.message}`);
  }

  return data as SubmittedBid;
}

//Fetching bid status for new bids
export async function updateBidStatus(
  userId: string,
  bidId: string,
  newStatus: string
): Promise<SubmittedBid | null> {
  const { data, error } = await supabase
    .from('submitted_bids')
    .update({
      bid_status: newStatus,
      last_updated: new Date().toISOString(), // optionally update last_updated
    })
    .eq('user_id', userId)
    .eq('bid_id', bidId)
    .single();

  if (error) {
    throw new Error(`Failed to update bid status: ${error.message}`);
  }

  return data as SubmittedBid;
}
