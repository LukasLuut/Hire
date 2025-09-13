// src/routes/auth.routes.ts
import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { validateDTO } from '../middlewares/validateDTO'
import { CreateUserDTO } from '../dtos/CreateUserDTO'
import { LoginUserDTO } from '../dtos/LoginUserDTO'

const router = Router()
const controller = new AuthController()

router.post('/register', validateDTO(CreateUserDTO), controller.register.bind(controller))
router.post('/login', validateDTO(LoginUserDTO), controller.login.bind(controller))

export default router