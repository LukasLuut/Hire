import { Router } from 'express'
import { ServiceController } from '../controllers/ServiceController';
import { upload } from '../middlewares/uploadMiddleware';

const serviceRouter = Router();
const controller = new ServiceController();

serviceRouter.post('/', upload.single("image"), controller.create.bind(controller));
serviceRouter.get('/', controller.list.bind(controller));
serviceRouter.get('/:id', controller.getById.bind(controller));
serviceRouter.put('/:id', controller.update.bind(controller));
serviceRouter.delete('/:id', controller.delete.bind(controller));

export default serviceRouter;

