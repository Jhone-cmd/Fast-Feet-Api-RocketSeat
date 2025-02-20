import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";

import { EditRecipientUseCase } from "./edit-recipient";

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: EditRecipientUseCase

describe('Edit Deliveryman', () => {
    beforeEach(() => {
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        sut = new EditRecipientUseCase(inMemoryRecipientRepository)
    })

    it('should be able to edit a deliveryman', async () => {
        
        await inMemoryRecipientRepository.create(
            makeRecipient({
                name: 'john doe',
                address: 'Rua Nada - Cidade Nova',
                phone:'(99) 8877-5544'
            }, new UniqueEntityId('recipient-1'))
        )

        const result = await sut.execute({
            recipientId: 'recipient-1', 
            name: 'John Doe 2',
            address: 'Rua Nova - Cidade Alegre',
            phone: '(88) 7766-2211'

        })       
        
        expect(result.isRight()).toBeTruthy();
        expect(inMemoryRecipientRepository.items[0]).toMatchObject({
            name: 'John Doe 2',
            address: 'Rua Nova - Cidade Alegre',
            phone: '(88) 7766-2211'
        });          
    })
})