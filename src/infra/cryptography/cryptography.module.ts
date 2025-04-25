import { Encrypter } from '@/domain/fast-feet/application/cryptography/encrypter'
import { HashComparer } from '@/domain/fast-feet/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/fast-feet/application/cryptography/hash-generator'
import { Module } from '@nestjs/common'
import { BcryptjsHasher } from './bcryptjs-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashGenerator, useClass: BcryptjsHasher },
    { provide: HashComparer, useClass: BcryptjsHasher },
  ],

  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
