// src/routes/index.ts
import { Router } from 'express'
import authRoutes from './authRoutes'
import userRouter from './userRoutes'
import categoryRouter from './categoryRoutes'
import providerRouter from './providerRoutes'
import serviceRouter from './serviceRoutes'
import hireRouter from './hireRoutes'

const router = Router()

router.use('/auth', authRoutes);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/providers', providerRouter);
router.use('/services', serviceRouter);
router.use('/hires', hireRouter);

export default router
