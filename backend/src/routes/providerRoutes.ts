import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMidlleware'
import { ProviderController } from '../controllers/ProviderController'

const providerRouter = Router()
const controller = new ProviderController()

providerRouter.post('/', authMiddleware, controller.create.bind(controller))
providerRouter.get('/', authMiddleware, controller.getById.bind(controller))
providerRouter.put('/', authMiddleware, controller.update.bind(controller))
providerRouter.delete('/', authMiddleware, controller.delete.bind(controller))

export default providerRouter;

