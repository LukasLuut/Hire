export interface Service {
    id: number;
    title: string;
    description_service: string;
    negotiable: boolean;
    price: string;
    duration: string;
    providerId?: number;
    categoryId?: number | null;
    subcategory?: string;
    requiresScheduling: boolean;
    likesNumber?: number;
    imageUrl?: string;
    acceptedTerms?: boolean;
    cancellationNotice?: string;
};