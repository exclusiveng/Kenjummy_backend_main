import express from 'express';
import { editUserDetail } from '../controllers/auth.controller';
import { editUserSchema } from '../schemas/edituser.schema';

const router = express.Router();

router.put('/:id', editUserSchema, editUserDetail);

export default router;
