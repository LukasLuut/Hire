import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { authMiddleware } from '../middlewares/authMidlleware'

const router = Router()
const controller = new UserController()

router.get('/me', authMiddleware, controller.getById.bind(controller))
// router.get('/:id', authMiddleware, controller.getById.bind(controller))
router.put('/me', authMiddleware, controller.update.bind(controller))
router.delete('/me', authMiddleware, controller.remove.bind(controller))

export default router

