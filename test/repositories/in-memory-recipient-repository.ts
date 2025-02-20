import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { RecipientRepository } from "@/domain/fast-feet/application/repositories/recipient-repository";
import type { Recipient } from "@/domain/fast-feet/enterprise/entities/recipient";

export class InMemoryRecipientRepository implements RecipientRepository {
	public items: Recipient[] = []

	async create(recipient: Recipient): Promise<void> {
		this.items.push(recipient)
	}

	async findByCPF(cpf: string): Promise<Recipient | null> {
		const recipient = this.items.find((item) => item.cpf.value === cpf)

		if (!recipient) return null

		return recipient
	}

	async findById(id: string): Promise<Recipient | null> {
		const recipient = this.items.find((item) => item.id.toString() === id)

		if (!recipient) return null

		return recipient
	}

	async findManyRecipient({ page }: PaginationParams): Promise<Recipient[]> {
		const recipient = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20)

		return recipient
	}

	async save(recipient: Recipient): Promise<void> {
		const recipientIndex = this.items.findIndex((item) => item.id === recipient.id)
		this.items[recipientIndex] = recipient
	}

	async delete(recipient: Recipient): Promise<void> {
		const recipientIndex = this.items.findIndex((item) => item.id === recipient.id)
		this.items.splice(recipientIndex, 1)
	}

	
}
