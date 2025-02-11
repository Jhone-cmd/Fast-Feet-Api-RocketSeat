import type { Recipient } from "../../enterprise/entities/recipient";

export interface RecipientRepository {
	create(recipient: Recipient): Promise<void>
}
