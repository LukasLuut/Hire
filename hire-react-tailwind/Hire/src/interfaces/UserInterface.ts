export interface User {
    id: number,
    name: string,
    email: string,
    cpf_cnpj?: string,
    about?:string,
    acceptedTerms?: boolean,
    acceptedAt?: Date,
}
