import { EmployeeRule } from './employee-rule'

it('should be able to verify that the rule is valid', () => {
  const rule = EmployeeRule.isValidRule('admin')
  expect(rule).toBeTruthy()
})
