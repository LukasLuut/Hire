import { Router } from 'express'
import { PaymentController } from '../controllers/PaymentController';

const paymentRouter = Router()
const controller = new PaymentController()

paymentRouter.post('/', controller.create.bind(controller));
paymentRouter.get('/', controller.list.bind(controller));
// paymentRouter.put('/:id', controller.update.bind(controller));
// paymentRouter.delete('/:id', controller.delete.bind(controller));

export default paymentRouter

