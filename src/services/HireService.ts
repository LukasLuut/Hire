import { AppDataSource } from "../config/data-source";
import { Category } from "../models/Category";
import { Hire } from "../models/Hire";

export class HireService {
    private hireRepository = AppDataSource.getRepository(Hire);

    async create(data: { price: number, description_service: string, firstContact: Date, providerId: string, userId: string, serviceId: string }) {
        const { price, description_service, firstContact, providerId, userId, serviceId } = data;

         const hire = this.hireRepository.create({
            price,
            description_service,
            firstContact,
            provider: { id: Number(providerId) },
            user: { id: Number(userId) },
            service: { id: Number(serviceId) }
         });

        return await this.hireRepository.save(hire);
    }

    async list() {
        return await this.hireRepository.find();
    }

    async update(id: number, data: Partial<Hire>) {
        const category = await this.hireRepository.findOne({ where: { id } });

        if (!category) throw new Error("Categoria não encontrada");
        const { ...rest } = data
        Object.assign(category, rest);
        return await this.hireRepository.save(category);
    }

    async remove(id: number) {
        const category = await this.hireRepository.findOne({ where: { id } });

        if (!category) throw new Error("Categoria não encontrada")

        await this.hireRepository.remove(category);

        return { message: "Categoria removida com sucesso" }
    }
}