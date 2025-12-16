// Importa tipos do Express para lidar com requisições e respostas
import { Request, Response } from 'express';

import { AppDataSource } from '../config/data-source';
import { Address } from '../models/Address';

export class AddressController {
    private addressRepository = AppDataSource.getRepository(Address);

     list = async (req: Request, res: Response) => {
    const users = await this.addressRepository.find();
    return res.json(users);
  }

    create = async (req: Request, res: Response) => {
    const { num, neighborhood, street, state, city, country, postalCode } = req.body;

    const address = this.addressRepository.create({ num, neighborhood, street, state, city, country, postalCode });
    await this.addressRepository.save(address);

    return res.status(201).json(address);
  }
}

