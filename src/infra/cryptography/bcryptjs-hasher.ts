import { HashComparer } from '@/domain/fast-feet/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/fast-feet/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptjsHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8
  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
