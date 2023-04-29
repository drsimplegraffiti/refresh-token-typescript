import { updateUserProfileHandler } from './../controllers/auth.controller';
import express from 'express';
import {
    getAllUsersHandler,
    getMeHandler,
} from '../controllers/user.controller';
import { requireUser } from '../middleware/requireUser';
import { restrictTo } from '../middleware/restrictTo';
import { deserializeUser } from '../middleware/deserialiseUser';
import { upload } from '../utils/fileupload';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Admin Get Users route
router.get('/', restrictTo('admin'), getAllUsersHandler);

// Get my info route
router.get('/me', getMeHandler);

//update user info route
router.patch('/update-me', upload.single('image'), updateUserProfileHandler);

export default router;
