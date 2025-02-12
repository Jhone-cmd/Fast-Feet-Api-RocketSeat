import { Employee } from "../../enterprise/entities/employee";
import type { Role } from "../../enterprise/entities/types/role";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import type { HashGenerator } from "../cryptography/hash-generator";
import type { EmployeeRepository } from "../repositories/employee-repository";

export interface EmployeeRequest {
	name: string
	email: string
	cpf: string
	password: string
	role: string
}

export interface EmployeeResponse {
    employee: Employee
}

export class RegisterEmployee {

	constructor(
		private employeeRepository: EmployeeRepository,
		private hashGenerator: HashGenerator,
	) {}
    
	async execute({ name, email, cpf, password, role }: EmployeeRequest): Promise<EmployeeResponse> {

		const employeeWithSameEmail =
			await this.employeeRepository.findByEmail(email)

		if (employeeWithSameEmail) {
			throw new Error("Email already exists")
		}

		const cpfFormatted = new CPF(cpf)
        const isValidCPF = CPF.isValid(cpfFormatted.value)

        if (!isValidCPF) {
            throw new Error('Invalid CPF')
        }

        const employeeWithSameCPF = await this.employeeRepository.findByCPF(cpfFormatted.value)

        if (employeeWithSameCPF) {
			throw new Error("CPF already exists")
		}

        const isValidResponsibility = Employee.isValidRole(role)

        if (!isValidResponsibility) {
            throw new Error('Error')
        }

		const passwordHash = await this.hashGenerator.hash(password)        

		const employee = Employee.create({
            name,
            email,
            cpf: cpfFormatted,
            password: passwordHash, 
            role: role as Role 
        })

        await this.employeeRepository.create(employee)

        return { employee }
	}
}
