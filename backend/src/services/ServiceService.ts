import { AppDataSource } from "../config/data-source";
import { Service } from "../models/Service";

interface ServiceInterface {
  title: string;
  description_service: string;
  negotiable: boolean;
  requiresScheduling: boolean;
  duration: string;
  subcategory: string;  
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
      requiresScheduling,
      duration,
      subcategory,
      providerId,
      categoryId,
      price,
    } = data;

    const imageUrl = file ? `/uploads/${file.filename}` : null;

    const service = this.serviceRepository.create({
      title,
      description_service,
      negotiable,
      requiresScheduling,
      duration,
      price,
      imageUrl,
      subcategory,
      provider: { id: Number(providerId) },
      category: { id: Number(categoryId) },
    });

    return await this.serviceRepository.save(service);
  }

  async list() {
    return await this.serviceRepository.find({ relations: { category: true, provider: true }});
  }

  async getById(id: number) {
    const service = await this.serviceRepository.findOne({ where: { id: id }, relations: { category: true, provider: true, hire: true }});
    return service;
  }

  async update(id: number, data: Partial<Service>, file?: Express.Multer.File) {
  const service = await this.serviceRepository.findOne({
    where: { id },
  });

  if (!service) {
    throw new Error('Serviço não encontrado');
  }

  if (file) {
    data.imageUrl = `/uploads/${file.filename}`;
  }

  Object.assign(service, data);
  return await this.serviceRepository.save(service);
}


  async remove(id: number) {
    const service = await this.serviceRepository.findOne({ where: { id } });

    if (!service) throw new Error("Serviço não encontrado");

    await this.serviceRepository.remove(service);

    return { message: "Serviço removido com sucesso" };
  }
}
