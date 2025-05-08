import { FakerHasher } from 'test/cryptography/faker-hasher'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { generateCPF } from 'test/utils/generate-cpf'
import { AccountAlreadyExists } from './errors/account-already-exists'
import { RegisterEmployeeUseCase } from './register-employee'

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
      cpf: generateCPF(),
      password: '123456',
      rule: 'admin',
    })

    expect(inMemoryEmployeeRepository.items).toHaveLength(1)
    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      employee: inMemoryEmployeeRepository.items[0],
    })
  })

  it('should not be able to register an employee with same email', async () => {
    await sut.execute({
      name: 'john doe',
      email: 'johndoe@email.com',
      cpf: generateCPF(),
      password: '123456',
      rule: 'admin',
    })

    const result = await sut.execute({
      name: 'john doe',
      email: 'johndoe@email.com',
      cpf: generateCPF(),
      password: '123456',
      rule: 'admin',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(AccountAlreadyExists)
  })

  it('should not be able register an employee with same cpf', async () => {
    await sut.execute({
      name: 'john doe',
      email: 'johndoe@email.com',
      cpf: '12345678910',
      password: '123456',
      rule: 'admin',
    })

    const result = await sut.execute({
      name: 'john doe',
      email: 'johndoe2@email.com',
      cpf: '12345678910',
      password: '123456',
      rule: 'admin',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(AccountAlreadyExists)
  })

  it('should hash password upon registration', async () => {
    const result = await sut.execute({
      name: 'john doe',
      email: 'johndoe@email.com',
      cpf: generateCPF(),
      password: '123456',
      rule: 'admin',
    })

    const hashedPassword = await fakerHasher.hash('123456')

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryEmployeeRepository.items[0].password).toEqual(hashedPassword)
  })
})
