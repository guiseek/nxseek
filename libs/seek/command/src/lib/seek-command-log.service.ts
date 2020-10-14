import { Injectable } from '@nestjs/common';
import { SeekCommandService } from './seek-command.service';

@Injectable()
export class SeekCommandLogService {
  constructor(private readonly commandService: SeekCommandService) {}

  log(message: string) {
    if (!this.isRunning) return;
    console.log(message);
  }

  error(message: string, trace: string) {
    if (!this.isRunning) return;
    console.error(message, trace);
  }

  warn(message: string) {
    if (!this.isRunning) return;
    console.warn(message);
  }

  private get isRunning(): boolean {
    return this.commandService.isRunning;
  }
}
