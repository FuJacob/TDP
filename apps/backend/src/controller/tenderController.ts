import {Request, Response }  from 'express';
import { supabase } from "../utils/supabaseClient";


// Fetch list of tenders for authenticated users
export const getUserTenders = async (req: Request, res: Response) => {
    try {
        
        // Extract user id
        const user_id = req.user?.id;
        if(!user_id) {
           return res.status(401).json({ success: false, message: 'Unauthorized: User id not found'})
        }

        // Filters from query params
        const {startDate, endDate, status} = req.query;
    
        // Getting tenders for authenticcated user
        let query = supabase
            .from('submitted_tenders')
            .select("submission_id, title, submitted_at, status, updated_at")
            .eq("user_id", user_id);

        if(startDate && endDate) {
            query = query.gte('submitted_at', startDate).lte('submitted_at', endDate);
        }

        if(status && ["Pending", "Approved", "Rejected"].includes(status as string)) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;

        return res.status(200).json({ success: true, data});

    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error"});
    }        
};
