export function generateCPF() {
    // Gera os 11 dígitos aleatórios
    let cpf = '';
    for (let i = 0; i < 11; i++) {
        cpf += Math.floor(Math.random() * 10).toString();
    }
    
    return cpf
}