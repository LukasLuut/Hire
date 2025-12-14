import { AnyARecord } from "dns";
import { AppDataSource } from "../config/data-source";
import { ServiceProvider } from "../models/ServiceProvider";
import { User } from "../models/User";

export class ProviderService {
  private providerRepository = AppDataSource.getRepository(ServiceProvider);
  private userRepository = AppDataSource.getRepository(User);

  async create(idUser: number, data: {
      companyName: string;
    }, file?: Express.Multer.File
  ) {

    const profileImageUrl = file ? `/uploads/${file.filename}` : null;

    const user = await this.userRepository.findOne({ where: { id: idUser}, relations: { provider: true }});
    if (!user) throw new Error("Usuário não existente");
    if(user.provider) throw new Error("Prestador de serviços já existente");

    const newData: any = { ...data, user, profileImageUrl };

    const provider = this.providerRepository.create(newData);

    return await this.providerRepository.save(provider);
  }

  async getById(id: number) {
    const provider = await this.providerRepository.findOne({
      relations: { user: true },
      where: {
        user: {
          id: id,
        },
      },
    });

    if (!provider) throw new Error("Provedor não encontrado");

    return provider;
  }

  async remove(id: number) {
    const provider = await this.providerRepository.findOne({
      where: {
        user: {
          id: id
        }
      }
    });

    if (!provider) throw new Error("Provedor não encontrado");


    await this.providerRepository.remove(provider);
    return { message: "Provedor removido" };
  }

  async list() {
    const users = await this.providerRepository.find();

    return users.map((u) => {
      const clone: any = { ...u };
      delete clone.password;
      return clone;
    });
  }

  //   async findById(id: number) {
  //     const user = await this.providerRepository.findOne({ where: { id } });

  //     if (!user) throw new Error("Usuário não encontrado");

  //     const clone: any = { ...user };
  //     delete clone.password;
  //     return clone;
  //   }

  async update(id: number, data: Partial<ServiceProvider>) {
    const user = await this.userRepository.findOne({ where: { id: id }, relations: { provider: true } })
    if (!user) throw new Error("Usuário não encontrado")

    const provider = await this.providerRepository.findOne({ where: { user: { id: id } }, relations: { user: true } });
    if (!provider) throw new Error("Provedor não encontrado");

    Object.assign(provider, data);

    return await this.providerRepository.save(provider);
  }

  //   async remove(id: number) {
  //     const user = await this.providerRepository.findOne({ where: { id } });

  //     if (!user) throw new Error("Usuário não encontrado");

  //     await this.providerRepository.remove(user);

  //     return { message: "Usuário removido" };
  //   }

  //   async findByEmail(email: string) {
  //     return this.providerRepository.findOne({ where: { email }, select: ['id', 'name', 'email', 'password', 'cpf_cnpj', 'address'] });
  //   }
}
