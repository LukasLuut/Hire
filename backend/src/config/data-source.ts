import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from "dotenv";

import { User } from '../models/User';
import { Address } from '../models/Address';
import { Category } from '../models/Category';
import { Service } from '../models/Service';
import { ServiceProvider } from '../models/ServiceProvider';
import { Hire } from '../models/Hire';
import { Contract } from '../models/Contract';
import { Payment } from '../models/Payment';
import { Subcategory } from '../models/Subcategory';
import { Availability } from '../models/Availability';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
    type: 'mysql',

    host: DB_HOST,

    port: Number(DB_PORT || "3306"),

    username: DB_USER,

    password: DB_PASSWORD,

    database: DB_NAME,

    // O synchronize: true cria automaticamente as tabelas e colunas com base nas entidades.
    // ⚠️ Importante: Isso é útil apenas em desenvolvimento.
    // Em produção, deve ser false, para não apagar ou alterar dados automaticamente.
    synchronize: true, 

    // logging: true faz o TypeORM mostrar no terminal todos os comandos SQL que ele está executando.
    logging: true,

    // Aqui registramos as entidades (as classes que representam tabelas).
    // O TypeORM precisa saber quais são para criar o mapeamento com o banco.
    entities: [User, Address, Category, Service, ServiceProvider, Hire, Contract, Payment, Subcategory, Availability],
});
