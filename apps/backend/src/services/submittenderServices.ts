import getStringParam from '../utils/getStringParam';
import { supabase } from '../utils/supabaseClient';

// Type definitions
interface SearchQueryParams {
  status?: string | string[];
  startDate?: string | string[];
  endDate?: string | string[];
  page?: string | string[];
  limit?: string | string[];
  sort_by?: string | string[];
}

interface RawSubTenderData {
  'submission_id': string;
  'tender_ref': string;
  'title': string;
  'user_id': string;
  'user_name': string;
  'status': string;
  'submitted_at': string;
  'updated_at': string;
}

export interface TransformedSubTender {
  subId: string;
  tenderRef: string;
  title: string;
  userId: string;
  userName: string;
  status: string;
  submittedAt: string;
  updatedAt: string;
}

interface SubTenderResult{
    subtenders: TransformedSubTender[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Submitted tender service
export async function searchSubTendersService(userId: string, queryParams: SearchQueryParams): Promise<SubTenderResult> { 
    
  console.log('userid in service', userId);
    const status = getStringParam(queryParams.status);
    const startDate = getStringParam(queryParams.startDate);
    const endDate = getStringParam(queryParams.endDate);
    const sort_by = getStringParam(queryParams.sort_by) || 'newest';

    // Pagination with defaults
    const page = Math.max(1, Number(getStringParam(queryParams.page)) || 1);
    const limit = Math.max(1, Number(getStringParam(queryParams.limit))) || 10;
    const offset = (page - 1) * limit;

  

    let dbQuery = supabase
        .from('submitted_tenders')
        .select("submission_id, title, submitted_at::date, status, updated_at::date")
        .eq('user_id', userId)
        .range(offset, offset + limit - 1);
 

    // Date range filter
    if(startDate && endDate) {
        dbQuery = dbQuery.gte('submitted_at', startDate).lte('submitted_at', endDate);
    }

    
    // Filter with status
    if(status && ["Pending", "Approved", "Rejected"].includes(status as string)) {
        dbQuery = dbQuery.eq('status', status);
    }

     // Sorting
  switch (sort_by) {
    case 'newest':
      dbQuery = dbQuery.order('submitted_at', { ascending: false });
      break;
    case 'oldest':
      dbQuery = dbQuery.order('submitted_at', { ascending: true });
      break;
    // Add more sorting options if needed
  }
    
    console.log(">>>dbQuery",dbQuery);
    const { data, error, count } = await dbQuery;
    console.log(">>>data",data);
    console.log(">>>error",error);
    console.log(">>>count",count);
 
    if (error) throw new Error(`Database error: ${error.message}`);
    
    // Data transformation
    const transformedSubTenders: TransformedSubTender[] = (data as RawSubTenderData[]).map(subtender => ({
      subId: subtender['submission_id'],
      tenderRef: subtender['tender_ref'],
      title: subtender['title'],
      userId: subtender['user_id'],
      userName: subtender['user_name'],
      status: subtender['status'],
      submittedAt: subtender['submitted_at'],
      updatedAt: subtender['updated_at'],
    }));
    

    return {
      subtenders: transformedSubTenders,
        pagination: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        }
      };
  
}

// Get Submitted Tender by ID
export async function getSubTenderById(userId: string, subId: string): Promise<TransformedSubTender | null> {
  const { data, error } = await supabase
    .from('submitted_bids')
    .select('*')
    .eq('user_id', userId)
    .eq('submission_id', subId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch tender: ${error.message}`);
  }

  return data as TransformedSubTender;
}

// Update Tender data
export async function updateSubTender(
  userId: string,
  subId: string,
  newStatus: string
): Promise<TransformedSubTender | null> {
  const { data, error } = await supabase
    .from('submitted_bids')
    .update({
      bid_status: newStatus,
      last_updated_date: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('submission_id', subId)
    .single();

  if (error) {
    throw new Error(`Failed to update bid status: ${error.message}`);
  }

  return data as TransformedSubTender;
}