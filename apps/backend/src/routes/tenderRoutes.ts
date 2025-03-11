import express, { Router } from 'express';
import { getUserTenders } from "../controller/tenderController";
import { authenticateUser } from '../middleware/authMiddleware';


const router: Router = express.Router();

// GET API to get list of tenders for auth user
router.get("/v1/user/submittedtenders", authenticateUser, getUserTenders);

export default router;