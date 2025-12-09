import express from 'express';
import { editUserDetail } from '../controllers/auth.controller';
import { editUserSchema } from '../schemas/edituser.schema';

import { protect, restrictTo } from '../middleware/protect.middleware';
import {
    getAllUsers,
    deleteUser,
    updateUserStatus,
    promoteToAdmin,
    demoteToUser,
} from '../controllers/user.controller';

const router = express.Router();

// Public or User-level routes
router.put('/:id', editUserSchema, editUserDetail);

// Protected routes
router.use(protect);
router.use(restrictTo('superadmin'));

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.patch('/:id/status', updateUserStatus);
router.patch('/:id/promote', promoteToAdmin);
router.patch('/:id/demote', demoteToUser);

export default router;
