import { Body, ConflictException, Controller, HttpCode, Post } from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";

@Controller('/accounts')
export class CreateAccountController {
    constructor(private prisma: PrismaService) {}

    @Post()
    @HttpCode(201)
    async handle(@Body() body: any) {
        const { name, email, cpf, password } = body

        const AccountEmailSameWithExists = await this.prisma.account.findUnique({
            where: {
                email
            }
        })

        if (AccountEmailSameWithExists) {
            throw new ConflictException('Email already exists')
        }

        await this.prisma.account.create({
            data: {
                name, 
                email,
                cpf,
                password
            }
        })
    }
}