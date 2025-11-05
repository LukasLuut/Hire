import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

// Middleware para proteger rotas que exigem autenticação
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Pega o header de autorização da requisição
  const authHeader = req.headers.authorization

  // Se não houver header ou ele não começar com "Bearer ", retorna erro 401 (não autorizado)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }

  // Extrai o token do header (remove o "Bearer " antes)
  const token = authHeader.split(' ')[1]

  // Verifica se o token é válido chamando a função verifyToken
  // Retorna o payload decodificado se válido, ou null se inválido/expirado
  const decoded = verifyToken(token)

  // Se o token for inválido, retorna erro 401
  if (!decoded) {
    return res.status(401).json({ message: 'Token inválido' })
  }

  // Armazena o payload decodificado no req para que outros middlewares ou controllers possam acessar
  // Ex.: req.user terá id e email do usuário logado
  (req as any).user = decoded

  // Chama o próximo middleware ou controller
  next()
}
