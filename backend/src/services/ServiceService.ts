import { AppDataSource } from "../config/data-source";
import { Category } from "../models/Category";
import { Service } from "../models/Service";

interface ServiceInterface {
  title: string;
  description_service: string;
  negotiable: boolean;
  duration: string;
  price: number;
  providerId: string;
  categoryId: string;
}

export class ServiceService {
  private serviceRepository = AppDataSource.getRepository(Service);

  async create(data: ServiceInterface, file?: Express.Multer.File) {
    const {
      title,
      description_service,
      negotiable,
      duration,
      providerId,
      categoryId,
      price,
    } = data;

    const imageUrl = file ? `/uploads/${file.filename}` : null;

    const service = this.serviceRepository.create({
      title,
      description_service,
      negotiable,
      duration,
      price,
      imageUrl,
      provider: { id: Number(providerId) },
      category: { id: Number(categoryId) },
    });

    return await this.serviceRepository.save(service);
  }

  async list() {
    return await this.serviceRepository.find();
  }

  async update(id: number, data: Partial<Service>) {
    const category = await this.serviceRepository.findOne({ where: { id } });

    if (!category) throw new Error("Categoria não encontrada");
    const { ...rest } = data;
    Object.assign(category, rest);
    return await this.serviceRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.serviceRepository.findOne({ where: { id } });

    if (!category) throw new Error("Categoria não encontrada");

    await this.serviceRepository.remove(category);

    return { message: "Categoria removida com sucesso" };
  }
}
