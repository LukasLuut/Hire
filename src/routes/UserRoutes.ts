import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { authMiddleware } from '../middlewares/authMidlleware'

const userRouter = Router()
const controller = new UserController()

userRouter.get('/me', authMiddleware, controller.getById.bind(controller))
// router.get('/:id', authMiddleware, controller.getById.bind(controller))
userRouter.put('/me', authMiddleware, controller.update.bind(controller))
userRouter.delete('/me', authMiddleware, controller.remove.bind(controller))

export default userRouter

