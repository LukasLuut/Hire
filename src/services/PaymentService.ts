import { AppDataSource } from "../config/data-source";
import { Category } from "../models/Category";
import { Payment } from "../models/Payment";

export class PaymentService {
    private paymentRepository = AppDataSource.getRepository(Payment);

    async create(data: {
        price: number, 
        method: string, 
        status: string, 
        hireId: number,
        providerId: number
    }) {

        const { price, method, status, hireId, providerId } = data;

        const payment = this.paymentRepository.create({
            price,
            method,
            status,
            date: new Date(),
            hire: { id: hireId },
            provider: { id: providerId },
        });

        return await this.paymentRepository.save(payment);
    }

    async list() {
        return await this.paymentRepository.find({ relations: { provider: true, hire: true}});
    }

    // async update(id: number, data: Partial<Category>) {
    //     const category = await this.paymentRepository.findOne({ where: { id } });

    //     if (!category) throw new Error("Categoria não encontrada");
    //     const { ...rest } = data
    //     Object.assign(category, rest);
    //     return await this.paymentRepository.save(category);
    // }

    // async remove(id: number) {
    //     const category = await this.paymentRepository.findOne({ where: { id } });

    //     if (!category) throw new Error("Categoria não encontrada")

    //     await this.paymentRepository.remove(category);

    //     return { message: "Categoria removida com sucesso" }
    // }
}