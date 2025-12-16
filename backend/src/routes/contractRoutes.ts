import { Router } from 'express'
import { ContractController } from '../controllers/ContractController';

const contractRouter = Router();
const controller = new ContractController();

contractRouter.post('/', controller.create.bind(controller));
contractRouter.get('/', controller.list.bind(controller));
contractRouter.get('/:id', controller.getById.bind(controller));
contractRouter.put('/:id', controller.update.bind(controller));
contractRouter.delete('/:id', controller.delete.bind(controller));

export default contractRouter;

