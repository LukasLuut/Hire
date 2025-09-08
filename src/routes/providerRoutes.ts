import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { authMiddleware } from '../middlewares/authMidlleware'

const providerRouter = Router()
const controller = new UserController()

providerRouter.post('/me', authMiddleware, controller.create.bind(controller))
// router.get('/:id', authMiddleware, controller.getById.bind(controller))
// providerRouter.put('/me', authMiddleware, controller.update.bind(controller))
// providerRouter.delete('/me', authMiddleware, controller.remove.bind(controller))

export default providerRouter;

