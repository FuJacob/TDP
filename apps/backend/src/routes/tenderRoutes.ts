// import express, { Router } from 'express';
// import { getUserTenders } from "../controller/tenderController";
// import { authenticateUser } from '../middleware/authMiddleware';


// const router: Router = express.Router();

// // GET API to get list of tenders for auth user
// router.get("/v1/user/submittedtenders", authenticateUser, getUserTenders);

// export default router;

import { Router } from 'express';
import { searchTendersHandler } from '../controllers/us-004/tender_controller';
import { subUserTenderHandler } from '../controllers/us-002/subtender_Controller';

const tenderRouter: Router = Router(); 

// Search available tenders
tenderRouter.get('/search', searchTendersHandler);

// Submitted tender list by auth user
tenderRouter.get('/submittedtenders', subUserTenderHandler);

export default tenderRouter;
