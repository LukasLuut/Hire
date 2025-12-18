import { AnyARecord } from "dns";
import { AppDataSource } from "../config/data-source";
import { ServiceProvider } from "../models/ServiceProvider";
import { User } from "../models/User";
import { Subcategory } from "../models/Subcategory";
import { Availability } from "../models/Availability";
import { Link } from "../models/Link";

export class ProviderService {
  private providerRepository = AppDataSource.getRepository(ServiceProvider);
  private userRepository = AppDataSource.getRepository(User);
  private subcategoryRepository = AppDataSource.getRepository(Subcategory);
  private linkRepository = AppDataSource.getRepository(Link);

  async create(
    idUser: number,
    data: {
      companyName: string;
      subcategories?: string;
      links?: string;
      },
    file?: Express.Multer.File
  ) {
    const profileImageUrl = file ? `/uploads/${file.filename}` : null;

    const user = await this.userRepository.findOne({
      where: { id: idUser },
      relations: { provider: true },
    });
    if (!user) throw new Error("Usuário não existente");

    if (user.provider) throw new Error("Prestador de serviços já existente");

    const newData: any = { ...data, user, profileImageUrl };

    const provider = this.providerRepository.create(newData);
    const providerSaved = await this.providerRepository.save(provider);

    const subcategories = JSON.parse(data.subcategories ? data.subcategories : "");
    const links = JSON.parse(data.links ? data.links : "");

    // Caso tenha subcategorias...
    if (Array.isArray(subcategories)) {
      var categoryList: Array<Object> = [];

      subcategories.forEach((element) => {
        categoryList.push({ name: element, provider: providerSaved });
      });

      const subcategoriesToSave = this.subcategoryRepository.create(categoryList);

      this.subcategoryRepository.save(subcategoriesToSave);
    }

    // Caso tenha subcategorias...
    if (Array.isArray(links)) {
      var linksList: Array<Object> = [];

      links.forEach((element) => {
        linksList.push({ name: element, provider: providerSaved });
      });

      const linksToSave = this.linkRepository.create(linksList);

      this.linkRepository.save(linksToSave);
    }

    return providerSaved;
  }

  async getById(id: number) {
    const provider = await this.providerRepository.findOne({
      relations: { user: true, subcategories: true, links: true, category: true },
      where: {
        user: {
          id: id,
        },
      },
    });

    if (!provider) throw new Error("Provedor não encontrado");

    return provider;
  }

  async getServices(id: number) {
    const provider = await this.providerRepository.findOne({
      relations: { services: {
        category: true
       } },
      where: {
        user: {
          id: id
        }
      }
    });

    if(!provider) throw new Error("Provedor não encontrado");

    return provider.services;
  }

  async remove(id: number) {
    const provider = await this.providerRepository.findOne({
      where: {
        user: {
          id: id,
        },
      },
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
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { provider: true },
    });
    if (!user) throw new Error("Usuário não encontrado");

    const provider = await this.providerRepository.findOne({
      where: { user: { id: id } },
      relations: { user: true },
    });
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
