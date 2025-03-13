import {Request, Response }  from 'express';
const submittenderServices = require('../../services/submittenderServices');


// Fetch list of tenders for authenticated users
export const subUserTenderHandler = async (req: Request, res: Response): Promise<Response> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')?.[1];
    console.log('Token:', token);

    try {

        // Extract and validate query parameters
        const queryParams = {
            status: req.query.status,
            startDate: req.query.submitted_at,
            endDate: req.query.submitted_at,
            page: req.query.page,
            limit: req.query.limit,
        };

        // Pass processed parameters to service
        const result = await submittenderServices.searchSubTendersService(token,queryParams);
       
        return res.status(200).json(result);
    } catch (error: unknown) {
        console.error('Error fetching submitted tenders:', error);
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unknown error occurred' });
    }      
};
