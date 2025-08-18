// Importa tipos do Express para lidar com requisições e respostas
import { Request, Response } from 'express';

import { User } from '../models/User';
import { AppDataSource } from '../config/data-source';

export class UserController {
    private userRepository = AppDataSource.getRepository(User);

     list = async (req: Request, res: Response) => {
    const users = await this.userRepository.find();
    return res.json(users);
  }


    create = async (req: Request, res: Response) => {
    const { name, email, password, cpf_cnpj } = req.body;

    const user = this.userRepository.create({ name, email, password, cpf_cnpj });
    await this.userRepository.save(user);

    return res.status(201).json(user);
  }
}

