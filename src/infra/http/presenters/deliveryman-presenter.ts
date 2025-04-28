import { Employee } from '@/domain/fast-feet/enterprise/entities/employee'

export class DeliveryManPresenter {
  static toHttp(deliveryman: Employee) {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      email: deliveryman.email,
      cpf: deliveryman.cpf.value.toString(),
      role: deliveryman.role,
    }
  }
}
