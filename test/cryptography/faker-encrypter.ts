import type { Encrypter } from 'src/domain/fast-feet/application/cryptography/encrypter'

export class FakerEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
