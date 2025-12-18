import { Request, Response } from 'express'
import { UserService } from '../services/UserService'
import { generateToken } from '../utils/jwt' // Importa a função que gera o JWT

const service = new UserService()

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const acceptedAt: Date = new Date();
      const body = {...req.body, acceptedAt}
      const user = await service.create(body)
      res.status(201).json(user)
    } catch (e: any) {
      res.status(400).json({ message: e.message })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const user = await service.findByEmail(email)
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })
  
      const valid = await user.validatePassword(password)
      if (!valid) return res.status(401).json({ message: 'Senha inválida' })
  
      const safe: any = { ...user }
      delete safe.password // Remove a senha antes de enviar os dados ao cliente
  
      const token = generateToken({ id: user.id, name: user.name, email: user.email, about: user.about })
      
      res.json({ user: safe, token })
    } catch (e: any) {
      res.status(400).json({ messages: e.message })
    }
  }
  
}
