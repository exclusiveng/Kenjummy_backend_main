import express from 'express';
import { editUserDetail } from '../controllers/auth.controller';
import { editUserSchema } from '../schemas/edituser.schema';

import { protect, restrictTo } from '../middleware/protect.middleware';
import {
    getAllUsers,
    deleteUser,
    updateUserStatus,
    promoteToAdmin,
} from '../controllers/user.controller';

const router = express.Router();

// Public or User-level routes
router.put('/:id', editUserSchema, editUserDetail);

// Admin-only routes
router.use(protect);
router.use(restrictTo('admin'));

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.patch('/:id/status', updateUserStatus);
router.patch('/:id/promote', promoteToAdmin);

export default router;
