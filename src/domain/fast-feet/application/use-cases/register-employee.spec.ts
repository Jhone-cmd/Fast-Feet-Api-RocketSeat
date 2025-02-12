import { FakerHasher } from "test/cryptography/faker-hasher"
import { InMemoryEmployeeRepository } from "test/repositories/in-memory-employee-repository"
import { EmployeeAlreadyExists } from "./errors/employee-already-exists"
import { RegisterEmployeeUseCase } from "./register-employee"

let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let fakerHasher: FakerHasher
let sut: RegisterEmployeeUseCase

describe('Register Employee', () => {
    beforeEach(() => {
        inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
        fakerHasher = new FakerHasher()
        sut = new RegisterEmployeeUseCase(inMemoryEmployeeRepository, fakerHasher)
    })

    it('should be able to register an employee', async () => {
        const result = await sut.execute({
            name: 'john doe',
            email: 'johndoe@email.com',
            cpf: '12345678910',
            password: '123456',
            role: 'admin'
        })

        expect(inMemoryEmployeeRepository.items).toHaveLength(1);
        expect(result.employee).toEqual(
            expect.objectContaining({
                name: 'john doe'
            })
        )
    })

    it('should not be able to register an employee with same email', async () => {

        await sut.execute({
            name: 'john doe',
            email: 'johndoe@email.com',
            cpf: '12345678910',
            password: '123456',
            role: 'admin'
        })
        
        const result = await sut.execute({
            name: 'john doe',
            email: 'johndoe@email.com',
            cpf: '12345678910',
            password: '123456',
            role: 'admin'
        })

        expect(result).toBeInstanceOf(EmployeeAlreadyExists)
    })


    it('should not be able register an employee with same cpf', async () => {

        await sut.execute({
            name: 'john doe',
            email: 'johndoe@email.com',
            cpf: '12345678910',
            password: '123456',
            role: 'admin'
        })

        const result = await sut.execute({
            name: 'john doe',
            email: 'johndoe2@email.com',
            cpf: '12345678910',
            password: '123456',
            role: 'admin'
        })

        expect(result).toBeInstanceOf(EmployeeAlreadyExists)

    })

    it('should hash password upon registration', async () => {
        await sut.execute({
            name: 'john doe',
            email: 'johndoe@email.com',
            cpf: '12345678910',
            password: '123456',
            role: 'admin'
        })

        const hashedPassword = await fakerHasher.hash('123456')

        expect(inMemoryEmployeeRepository.items[0].password).toEqual(hashedPassword)
    })
})
