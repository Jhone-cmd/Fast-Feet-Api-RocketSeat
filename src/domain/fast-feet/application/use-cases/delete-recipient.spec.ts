import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { DeleteRecipientUseCase } from "./delete-recipient";

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: DeleteRecipientUseCase

describe('Delete Deliveryman', () => {
    beforeEach(() => {
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        sut = new DeleteRecipientUseCase(inMemoryRecipientRepository)
    })

    it('should be able to delete a recipient', async () => {
     
       await inMemoryRecipientRepository.create(
            makeRecipient({}, new UniqueEntityId('recipient-1'))
        )

        await inMemoryRecipientRepository.create(
            makeRecipient({}, new UniqueEntityId('recipient-2'))
        )
        await sut.execute({
            recipientId: 'recipient-1'
        })       

        expect(inMemoryRecipientRepository.items).toHaveLength(1);        
            
    })

})