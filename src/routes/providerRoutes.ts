import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMidlleware'
import { ProviderController } from '../controllers/ProviderController'

const providerRouter = Router()
const controller = new ProviderController()

providerRouter.post('/me', authMiddleware, controller.create.bind(controller))
providerRouter.get('/me', authMiddleware, controller.getById.bind(controller))
providerRouter.put('/me', authMiddleware, controller.update.bind(controller))
providerRouter.delete('/me', authMiddleware, controller.delete.bind(controller))

export default providerRouter;

