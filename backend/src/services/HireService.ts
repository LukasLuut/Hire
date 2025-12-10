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
        return await this.hireRepository.find({ relations: { user: true, provider: true, service: true }});
    }

    async update(id: number, data: Partial<Hire>) {
        const hire = await this.hireRepository.findOne({ where: { id } });

        if (!hire) throw new Error("Serviço não encontrado");
        const { ...rest } = data
        Object.assign(hire, rest);
        return await this.hireRepository.save(hire);
    }

    async remove(id: number) {
        const hire = await this.hireRepository.findOne({ where: { id } });

        if (!hire) throw new Error("Serviço não encontrado")

        await this.hireRepository.remove(hire);

        return { message: "Serviço removido com sucesso" }
    }
}