// src/routes/index.ts
import { Router } from 'express'
import authRoutes from './authRoutes'
import userRouter from './UserRoutes'
import categoryRouter from './categoryRoutes'

const router = Router()

router.use('/auth', authRoutes);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);

export default router
