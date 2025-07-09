import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const config = new DocumentBuilder()
    .setTitle('Fast Feet Api')
    .setDescription(`Bem-vindo(a) à Documentação da API Fast Feet! Esta API impulsiona um sistema robusto de gerenciamento de entregas, projetado para otimizar as operações de empresas de entrega, desde a criação do pedido até a entrega final.
      \nA API Fast Feet facilita o manuseio eficiente das entregas, oferecendo funcionalidades distintas para administradores e entregadores.Administradores têm controle abrangente sobre o sistema, incluindo gerenciamento de usuários (entregadores), gerenciamento do ciclo de vida dos pedidos e detalhes dos destinatários. 
      \n Entregadores podem gerenciar suas entregas atribuídas, acompanhar seu progresso e garantir entregas pontuais e precisas. Esta documentação fornece informações detalhadas sobre todos os endpoints disponíveis, formatos de requisição e resposta, métodos de autenticação e regras de negócio, capacitando desenvolvedores a integrar e aproveitar de forma transparente todas as capacidades da plataforma Fast Feet.     `)
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
    })
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, documentFactory)

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()
