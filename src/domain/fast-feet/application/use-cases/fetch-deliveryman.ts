import { type Either, right } from "@/core/function/either";
import type { Employee } from "../../enterprise/entities/employee";
import type { EmployeeRepository } from "../repositories/employee-repository";

export interface FetchDeliveryManUseCaseRequest {
	page: number;
}

type FetchDeliveryManUseCaseResponse = Either<
	null,
	{
		deliveryMan: Employee[];
	}
>;

export class FetchDeliveryManUseCase {
	constructor(private employeeRepository: EmployeeRepository) {}

	async execute({
		page,
	}: FetchDeliveryManUseCaseRequest): Promise<FetchDeliveryManUseCaseResponse> {
		const deliveryMan = await this.employeeRepository.findManyDeliveryMan({
			page,
		});
		return right({ deliveryMan });
	}
}
