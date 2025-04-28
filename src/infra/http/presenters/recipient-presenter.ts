import { Recipient } from '@/domain/fast-feet/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHttp(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf.value.toString(),
      phone: recipient.phone,
      address: recipient.address,
    }
  }
}
