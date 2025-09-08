import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";

export class UserService {
  private repo = AppDataSource.getRepository(User);

  async create(data: {
    name: string;
    email: string;
    password: string;
    cpf_cnpj: string;
  }) {
    const exists = await this.repo.findOne({ where: { email: data.email } });

    if (!exists) throw new Error("Usuário não existente");

    const user = this.repo.create(data);
    await this.repo.save(user);

    const clone: any = { ...user };
    delete clone.password;
    return clone;
  }

  async findAll() {
    const users = await this.repo.find();

    return users.map((u) => {
      const clone: any = { ...u };
      delete clone.password;
      return clone;
    });
  }

  async findById(id: number) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) throw new Error("Usuário não encontrado");

    const clone: any = { ...user };
    delete clone.password;
    return clone;
  }

  async update(id: number, data: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) throw new Error("Usuário não encontrado");

    if (data.password) {
      user.password = data.password;
    }

    const { password, ...rest } = data;
    Object.assign(user, rest);

    return await this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) throw new Error("Usuário não encontrado");

    await this.repo.remove(user);

    return { message: "Usuário removido" };
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, select: ['id', 'name', 'email', 'password', 'cpf_cnpj', 'address'] });
  }
}
