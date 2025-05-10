import { EmployeeRule } from './employee-rule'

it('should be able to verify that the rule is valid', () => {
  const rule = EmployeeRule.isValidRule('deliveryman')
  expect(rule).toBeTruthy()
})

it('should be able to verify rule is an  admin', () => {
  const rule = EmployeeRule.isAdmin('admin')
  expect(rule).toBeTruthy()
})
