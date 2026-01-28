import { Router } from 'express'
import { HireController } from '../controllers/HireController';

const hireRouter = Router()
const controller = new HireController()

hireRouter.post('/', controller.create.bind(controller));
hireRouter.get('/', controller.list.bind(controller));
hireRouter.get('/provider/:id', controller.getByProviderId.bind(controller));
hireRouter.put('/:id', controller.update.bind(controller));
hireRouter.delete('/:id', controller.delete.bind(controller));

export default hireRouter

