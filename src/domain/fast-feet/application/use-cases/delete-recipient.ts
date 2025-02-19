import { ResourceNotFound } from "@/core/errors/error/resource-not-found";
import { type Either, left, right } from "@/core/function/either";
import type { RecipientRepository } from "../repositories/recipient-repository";

export interface DeleteRecipientUseCaseRequest {
    recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<ResourceNotFound, null>

export class DeleteRecipientUseCase {
    
    constructor (private recipientRepository: RecipientRepository) {}

    async execute({ recipientId }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
        const recipient = await this.recipientRepository.findById(recipientId)

        if (!recipient) return left(new ResourceNotFound)

        await this.recipientRepository.delete(recipient)

        return right(null)
    }
}