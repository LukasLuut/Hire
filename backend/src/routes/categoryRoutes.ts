import { Router } from 'express'
import { CategoryController } from '../controllers/CategoryController'

const categoryRouter = Router()
const controller = new CategoryController()

categoryRouter.post('/', controller.create.bind(controller));
categoryRouter.get('/', controller.list.bind(controller));
categoryRouter.put('/:id', controller.update.bind(controller));
categoryRouter.delete('/:id', controller.delete.bind(controller));

export default categoryRouter

