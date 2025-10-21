// src/routes/index.ts
import { Router } from 'express'
// import authRoutes from './authRoutes'
// import userRouter from './userRoutes'
import categoryRouter from './categoryRoutes'
// import providerRouter from './providerRoutes'

const router = Router()

// router.use('/auth', authRoutes);
// router.use('/users', userRouter);
router.use('/categories', categoryRouter);
// router.use('/providers', providerRouter)

export default router
