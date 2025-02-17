import { type Either, left, right } from "@/core/function/either";
import { Recipient } from "../../enterprise/entities/recipient";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import type { RecipientRepository } from "../repositories/recipient-repository";
import { InvalidCPF } from "./errors/invalid-cpf";
import { UserAlreadyExists } from "./errors/user-already-exists";

export interface CreateRecipientUseCaseRequest {
	name: string;
	address: string;
	phone: string;
	cpf: string;
}

type CreateRecipientUseCaseResponse = Either<
	UserAlreadyExists,
	{ recipient: Recipient }
>;

export class CreateRecipientUseCase {
	constructor(private recipientRepository: RecipientRepository) {}

	async execute({
		name,
		address,
		phone,
		cpf,
	}: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
		const cpfFormatted = new CPF(cpf);
		const isValidCPF = CPF.isValid(cpfFormatted.value);

		if (!isValidCPF) {
			return left(new InvalidCPF(cpfFormatted.value));
		}

		const recipientWithSameCPF = await this.recipientRepository.findByCPF(
			cpfFormatted.value,
		);

		if (recipientWithSameCPF) {
			return left(new UserAlreadyExists(cpfFormatted.value));
		}

		const recipient = Recipient.create({
			name,
			address,
			phone,
			cpf: cpfFormatted,
		});

		await this.recipientRepository.create(recipient);

		return right({ recipient });
	}
}
