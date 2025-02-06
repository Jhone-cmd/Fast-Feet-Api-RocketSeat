import { CPF } from './cpf';

it('should be able create a new slug from text', () => {
  const cpf = CPF.isValid('123.456.789-12')
  expect(cpf).toBeTruthy()
})
