import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Recipient, type RecipientProps } from "@/domain/fast-feet/enterprise/entities/recipient";
import { CPF } from "@/domain/fast-feet/enterprise/entities/value-objects/cpf";
import { faker, fakerPT_BR } from "@faker-js/faker";
import { generateCPF } from "test/utils/generate-cpf";

export function makeRecipient (
    override: Partial<RecipientProps> = {},
    id?: UniqueEntityId
) {
    const recipient = Recipient.create({
        name: faker.person.fullName(),
        address: fakerPT_BR.location.city(),
        phone: fakerPT_BR.phone.number({ style: "national" }),
        cpf: new CPF(generateCPF()),   
        ...override     
    }, id)

    return recipient
}