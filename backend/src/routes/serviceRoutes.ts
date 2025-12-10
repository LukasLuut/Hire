import { Router } from 'express'
import { ServiceController } from '../controllers/ServiceController';

const serviceRouter = Router();
const controller = new ServiceController();

serviceRouter.post('/', controller.create.bind(controller));
serviceRouter.get('/', controller.list.bind(controller));
serviceRouter.put('/:id', controller.update.bind(controller));
serviceRouter.delete('/:id', controller.delete.bind(controller));

export default serviceRouter;

