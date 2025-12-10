// src/routes/index.ts
import { Router } from 'express'
import authRoutes from './authRoutes'
import userRouter from './UserRoutes'
import categoryRouter from './categoryRoutes'
import providerRouter from './providerRoutes'
import serviceRouter from './serviceRoutes'
import hireRouter from './hireRoutes'
import paymentRouter from './paymentRoutes'
import contractRouter from './contractRoutes'

const router = Router()

router.use('/auth', authRoutes);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/providers', providerRouter);
router.use('/services', serviceRouter);
router.use('/hires', hireRouter);
router.use('/payments', paymentRouter);
router.use('/contracts', contractRouter);

export default router
