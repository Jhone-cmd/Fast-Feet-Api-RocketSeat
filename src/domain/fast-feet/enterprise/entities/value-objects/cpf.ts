export class CPF {
    public value: string

    constructor(value: string) {
        this.value = this.formatted(value)
    }

    static isValid(cpf: string): boolean { 
        cpf.replace(/[^\d]+/g, ''); 

        if (cpf.length === 11) {
            return true
        }
                           
        if (/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/.test(cpf)) {
            return true
        }
         
        return false
    }

    private formatted(cpf: string): string {
        cpf.replace(/[^\d]+/g, ''); 
        
        return cpf
    }
}