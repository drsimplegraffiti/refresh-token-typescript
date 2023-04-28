import express from 'express';
import {
    getAllUsersHandler,
    getMeHandler,
} from '../controllers/user.controller';
import { requireUser } from '../middleware/requireUser';
import { restrictTo } from '../middleware/restrictTo';
import { deserializeUser } from '../middleware/deserialiseUser';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Admin Get Users route
router.get('/', restrictTo('admin'), getAllUsersHandler);

// Get my info route
router.get('/me', getMeHandler);

export default router;
