// Importa o "reflect-metadata", que é essencial para o TypeORM funcionar.
// Ele habilita o uso de decorators (@Entity, @Column, etc.) para mapear classes em tabelas do banco. Mapear classes em tabelas do banco significa transformar cada classe do código em uma tabela do banco de dados, onde cada propriedade da classe vira uma coluna e cada objeto vira um registro.
import 'reflect-metadata';

// Importa a classe DataSource do TypeORM.
// O DataSource é a configuração principal de conexão com o banco de dados.
// Ele sabe qual banco usar, onde conectar, quais entidades existem, etc.
import { DataSource } from 'typeorm';

// Importa a biblioteca dotenv, que serve para carregar variáveis de ambiente do arquivo .env
// Isso evita colocar senhas e dados sensíveis diretamente no código.
import * as dotenv from "dotenv";

// Importa as entidades do projeto. Entidades são justamente as classes que representam tabelas do banco de dados dentro do código, descrevendo seus campos (colunas) e relações com outras tabelas.
// Aqui o TypeORM precisa saber quais classes representam tabelas do banco.
import { User } from '../models/User';
import { Address } from '../models/Address';
import { Category } from '../models/Category';

// Carrega as variáveis de ambiente do arquivo .env para o process.env
// Agora podemos acessar process.env.DB_HOST, process.env.DB_USER, etc.
dotenv.config();

// Aqui pegamos as variáveis de ambiente definidas no arquivo .env
// O destructuring facilita, pegando cada valor e guardando em uma constante.
// process.env é um objeto do Node.js que guarda variáveis do arquivo .env
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Criamos e exportamos a configuração principal do banco de dados usando o TypeORM.
// O DataSource vai ser usado em qualquer parte do projeto onde precisarmos interagir com o banco.
/* É uma classe do TypeORM que representa a configuração e a conexão com o banco de dados. Quando você cria uma instância dela, você define:
    - Tipo do banco (mysql, postgres, etc.)
    - Host, porta, usuário, senha
    - Quais entidades usar
    - Se vai sincronizar tabelas automaticamente (synchronize)
*/
export const AppDataSource = new DataSource({
    // Qual tipo de banco vamos usar. Pode ser "mysql", "postgres", "sqlite", etc.
    type: 'mysql',

    // Endereço onde o banco está rodando. Pode ser um IP, localhost, etc.
    host: DB_HOST,

    // Porta de conexão do banco. MySQL por padrão usa 3306.
    port: Number(DB_PORT || "3306"),

    // Nome do usuário para acessar o banco de dados.
    username: DB_USER,

    // Senha do usuário do banco de dados.
    password: DB_PASSWORD,

    // Nome do banco de dados que vamos usar.
    database: DB_NAME,

    // O synchronize: true cria automaticamente as tabelas e colunas com base nas entidades.
    // ⚠️ Importante: Isso é útil apenas em desenvolvimento.
    // Em produção, deve ser false, para não apagar ou alterar dados automaticamente.
    synchronize: true, 

    // logging: true faz o TypeORM mostrar no terminal todos os comandos SQL que ele está executando.
    logging: true,

    // Aqui registramos as entidades (as classes que representam tabelas).
    // O TypeORM precisa saber quais são para criar o mapeamento com o banco.
    entities: [User, Address, Category],
});
