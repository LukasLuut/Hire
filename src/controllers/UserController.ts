// Importa tipos do Express para lidar com requisições e respostas
import { Request, Response } from 'express';

import { User } from '../models/User';
import { AppDataSource } from '../config/data-source';
import { UserService } from '../services/UserService';

const userService = new UserService();


export class UserController {

     list = async (req: Request, res: Response) => {
    const users = await userService.findAll();
    return res.json(users);
  }

    create = async (req: Request, res: Response) => {
    try {
        const user = await userService.create(req.body);
        res.status(201).json(user);
    } 
    catch(err: any) {
      res.status(400).json({message: err.message})
    }
  }

    update = async (req: Request, res: Response) => {
      try {
            const user = await userService.update((req as any).user.id, req.body)
            const clone: any = { ...user }
            delete clone.password
            res.json(clone)
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const result = await userService.remove((req as any).user.id)
            res.json(result)
        } catch (e: any) {
            res.status(404).json({ message: e.message })
        }
    }

    async getById(req: Request, res: Response) {
        try {
            // const user = await service.findById(Number(req.params.id));
            const user = await userService.findById((req as any).user.id)
            res.json(user)
        } catch (e: any) {
            res.status(404).json({ message: e.message })
        }
    }

}

