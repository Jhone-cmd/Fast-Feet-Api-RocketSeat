export class EmployeeRule {
  public value: string
  constructor(value: string) {
    this.value = value
  }

  static isValidRule(rule: string): rule is 'admin' | 'deliveryman' {
    const responsibility: string[] = ['admin', 'deliveryman']
    return responsibility.includes(rule)
  }

  static isAdmin(rule: string): boolean {
    if (rule === 'admin') {
      return true
    }

    return false
  }
}
