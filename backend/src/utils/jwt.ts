import jwt from 'jsonwebtoken'

interface Payload {
  id: number
  email: string
}

export const generateToken = (payload: Payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET = "23412343", {
    expiresIn: Number(process.env.JWT_EXPIRES_IN)
  })
}

export const verifyToken = (token: string) => {
    try {
        // valida o token que estamos passando
        // se for válido, retorna as informações decodificadas do payload (no nosso caso, id e email)
        return jwt.verify(token, process.env.JWT_SECRET!)
    }
    catch (err: any) {
        // se for válido, retorna null
        return null;
    }
}
