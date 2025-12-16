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

    async update(id: number, data: Partial<Category>) {
        const payment = await this.paymentRepository.findOne({ where: { id } });

        if (!payment) throw new Error("Pagamento não encontrado");
        const { ...rest } = data
        Object.assign(payment, rest);
        return await this.paymentRepository.save(payment);
    }

    async remove(id: number) {
        const payment = await this.paymentRepository.findOne({ where: { id } });

        if (!payment) throw new Error("Pagamento não encontrado")

        await this.paymentRepository.remove(payment);

        return { message: "Pagamento removido com sucesso" }
    }

    async getById(id: number) {
        const payment = await this.paymentRepository.findOne({ where: { id }, relations: { provider: true, hire: true} });

        if(!payment) throw new Error("Pagamento não encontrado");

        return payment;

    }
}