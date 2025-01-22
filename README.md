# App
    - Fast Feet Api

## RF (Regras Funcionais da aplicação)
 - [] A aplicação deve ter dois tipos de usuário, entregador e/ou admin;
 - [] Deve ser possível realizar login com CPF e Senha;
 - [] Deve ser possível realizar o CRUD dos entregadores;
 - [] Deve ser possível realizar o CRUD das encomendas;
 - [] Deve ser possível realizar o CRUD dos destinatários;
 - [] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada);
 - [] Deve ser possível retirar uma encomenda;
 - [] Deve ser possível marcar uma encomenda como entregue;
 - [] Deve ser possível marcar uma encomenda como devolvida;
 - [] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador;
 - [] Deve ser possível alterar a senha de um usuário;
 - [] Deve ser possível listar as entregas de um usuário;
 - [] Deve ser possível notificar o destinatário a cada alteração no status da encomenda;

## RN (Regras de Negócios)
 - [] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas;
 - [] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores;
 - [] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários;
 - [] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto;
 - [] Somente o entregador que retirou a encomenda pode marcar ela como entregue;
 - [] Somente o admin pode alterar a senha de um usuário;
 - [] Não deve ser possível um entregador listar as encomendas de outro entregador;

## RNF (Requisitos Não Funcionais)
 - [] A senha do usuário precisa estar criptografada; 
 - [] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
 - [] Todas as listas de dados precisam estar paginadas com 20 itens por página;
 - [] O usuário deve ser autenticado por um JWT (Json Web Token);