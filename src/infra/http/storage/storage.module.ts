import { Uploader } from '@/domain/fast-feet/application/storage/uploader'
import { EnvModule } from '@/infra/env/env.module'
import { Module } from '@nestjs/common'
import { R2Storage } from './r2-storage'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],

  exports: [Uploader],
})
export class StorageModule {}
