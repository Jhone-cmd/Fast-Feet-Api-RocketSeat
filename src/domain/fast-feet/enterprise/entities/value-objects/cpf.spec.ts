import { CPF } from './cpf';

it('should be able create a valid cpf', () => {
  const cpf = CPF.isValid('123.456.789-12')
  expect(cpf).toBeTruthy()
})
