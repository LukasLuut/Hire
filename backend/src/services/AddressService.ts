import { AppDataSource } from "../config/data-source";
import { Address } from "../models/Address";
import { Category } from "../models/Category";
import { User } from "../models/User";

export class AddressService {
    private addressRepository = AppDataSource.getRepository(Address);
    private userRepository = AppDataSource.getRepository(User)

    async create(userId: number, data: { num: number, street: string, neighborhood: string, city: string, state: string, country: string, postalCode: string }) {

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error("Usuário não existente");

        console.log("SOCORRO ME AJUDA")
        console.log(user.name)
        
        const address = this.addressRepository.create(data);
        await this.addressRepository.save(address)

        user.address = address;
        await this.userRepository.save(user);

        return address;
    }

    // async list() {
    //     return await this.addressRepository.find();
    // }

    // async update(id: number, data: Partial<Category>) {
    //     const category = await this.addressRepository.findOne({ where: { id } });

    //     if (!category) throw new Error("Categoria não encontrada");
    //     const { ...rest } = data
    //     Object.assign(category, rest);
    //     return await this.addressRepository.save(category);
    // }

    // async remove(id: number) {
    //     const category = await this.addressRepository.findOne({ where: { id } });

    //     if (!category) throw new Error("Categoria não encontrada")

    //     await this.addressRepository.remove(category);

    //     return { message: "Categoria removida com sucesso" }
    // }
}