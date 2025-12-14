import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMidlleware'
import { ProviderController } from '../controllers/ProviderController'
import { upload } from '../middlewares/uploadMiddleware'

const providerRouter = Router()
const controller = new ProviderController()

providerRouter.post('/', authMiddleware, upload.single("image"), controller.create.bind(controller))
providerRouter.get('/', authMiddleware, controller.getById.bind(controller))
providerRouter.put('/', authMiddleware, controller.update.bind(controller))
providerRouter.delete('/', authMiddleware, controller.delete.bind(controller))

providerRouter.get('/all', controller.list.bind(controller));

export default providerRouter;

