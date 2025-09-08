import { AppDataSource } from "../config/data-source";
import { ServiceProvider } from "../models/ServiceProvider";
import { User } from "../models/User";

export class ProviderService {
  private providerRepository = AppDataSource.getRepository(ServiceProvider);
  private userRepository = AppDataSource.getRepository(User);
  

  async create(idUser:number, data: {
    companyName: string;
  }) {
    const user = await this.userRepository.findOne({ where: { id: idUser } });

    if (!user) throw new Error("Usuário não existente");

    const newData: any = { ...data, user};

    const provider = this.providerRepository.create(newData);

    return await this.providerRepository.save(provider);

  }

//   async findAll() {
//     const users = await this.providerRepository.find();

//     return users.map((u) => {
//       const clone: any = { ...u };
//       delete clone.password;
//       return clone;
//     });
//   }

//   async findById(id: number) {
//     const user = await this.providerRepository.findOne({ where: { id } });

//     if (!user) throw new Error("Usuário não encontrado");

//     const clone: any = { ...user };
//     delete clone.password;
//     return clone;
//   }

//   async update(id: number, data: Partial<ServiceProvider>) {
//     const user = await this.providerRepository.findOne({ where: { id } });

//     if (!user) throw new Error("Usuário não encontrado");

//     if (data.password) {
//       user.password = data.password;
//     }

//     const { password, ...rest } = data;
//     Object.assign(user, rest);

//     return await this.providerRepository.save(user);
//   }

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
