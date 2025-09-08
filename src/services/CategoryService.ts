import { AppDataSource } from "../config/data-source";
import { Category } from "../models/Category";

export class CategoryService {
    private categoryRepository = AppDataSource.getRepository(Category);

    async create(data: { name: string, description: string }) {
        const exists = await this.categoryRepository.findOne({ where: { name: data.name } });

        if (exists) throw new Error("Categoria já existente");

        const category = this.categoryRepository.create(data);
        return await this.categoryRepository.save(category);
    }

    async list() {
        return await this.categoryRepository.find();
    }

    async update(id: number, data: Partial<Category>) {
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) throw new Error("Categoria não encontrada");
        const { ...rest } = data
        Object.assign(category, rest);
        return await this.categoryRepository.save(category);
    }

    async remove(id: number) {
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) throw new Error("Categoria não encontrada")

        await this.categoryRepository.remove(category);

        return { message: "Categoria removida com sucesso" }
    }
}