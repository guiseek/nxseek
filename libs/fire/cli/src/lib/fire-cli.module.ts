import { Module, Global } from '@nestjs/common';
import { SeekCommandModule } from '@nxseek/command';
import { FireCliCommand } from './fire-cli.command';
import { FireCliService } from './fire-cli.service';

@Global()
@Module({
  imports: [SeekCommandModule],
  providers: [FireCliService, FireCliCommand],
  exports: [FireCliService],
})
export class FireCliModule {}
