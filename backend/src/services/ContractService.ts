import { AppDataSource } from "../config/data-source";
import { Contract } from "../models/Contract";

interface ContractInterface {
    code: string;
    price: number;
    description_service: string;
    providerId: number;
    hireId: number;
    userId: number;
    firstContact: Date;
    lastContact: Date;
}

export class ContractService {
    private contractRepository = AppDataSource.getRepository(Contract);

    async create(data: ContractInterface) {
        const exists = await this.contractRepository.findOne({
            where: { code: data.code },
        });

        if (exists) throw new Error("Contrato já existente");

        const bodyCopy = {
            code: data.code,
            price: data.price,
            description_service: data.description_service,
            provider: { id: data.providerId},
            hire: { id: data.hireId},
            user: { id: data.userId},
            firstContact: data.firstContact,
            lastContact: data.lastContact
        }

        const contract = this.contractRepository.create(bodyCopy);
        return await this.contractRepository.save(contract);
    }

    async list() {
        return await this.contractRepository.find();
    }

    async update(id: number, data: Partial<Contract>) {
        const contract = await this.contractRepository.findOne({ where: { id } });

        if (!contract) throw new Error("Contrato não encontrado");
        const { ...rest } = data;
        Object.assign(contract, rest);
        return await this.contractRepository.save(contract);
    }

    async remove(id: number) {
        const contract = await this.contractRepository.findOne({ where: { id } });

        if (!contract) throw new Error("Contrato não encontrado");

        await this.contractRepository.remove(contract);

        return { message: "Categoria removida com sucesso" };
    }

    async getById(id: number) {
        const contract = await this.contractRepository.findOne({ where: { id }, relations: { provider: true, hire: true, user: true } });

        if (!contract) throw new Error("Contrato não encontrado");

        return contract;
    }
}
