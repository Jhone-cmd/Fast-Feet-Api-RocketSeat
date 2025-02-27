import { FakerEncrypter } from 'test/cryptography/faker-encrypter'
import { FakerHasher } from 'test/cryptography/faker-hasher'
import { makeEmployee } from 'test/factories/make-employee'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentials } from './errors/invalid-credentials'

let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let fakerEncrypter: FakerEncrypter
let fakerHasher: FakerHasher
let sut: AuthenticateUseCase

describe('Authenticate', () => {
  beforeEach(() => {
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    fakerEncrypter = new FakerEncrypter()
    fakerHasher = new FakerHasher()

    sut = new AuthenticateUseCase(
      inMemoryEmployeeRepository,
      fakerHasher,
      fakerEncrypter
    )
  })

  it('should be able to authenticate', async () => {
    const employee = makeEmployee({
      password: await fakerHasher.hash('123456'),
    })

    inMemoryEmployeeRepository.items.push(employee)

    const result = await sut.execute({
      cpf: employee.cpf.value,
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong cpf', async () => {
    const employee = makeEmployee({
      password: await fakerHasher.hash('123456'),
    })

    inMemoryEmployeeRepository.items.push(employee)

    const result = await sut.execute({
      cpf: '12345678910',
      password: '123456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const employee = makeEmployee({
      password: await fakerHasher.hash('123456'),
    })

    inMemoryEmployeeRepository.items.push(employee)

    const result = await sut.execute({
      cpf: employee.cpf.value,
      password: '1234567',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })
})
