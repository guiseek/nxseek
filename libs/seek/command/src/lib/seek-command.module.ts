import { Module, Global, OnModuleInit } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core';
import { SeekCommandExplorerService } from './seek-command-explorer.service';
import { SeekCommandService } from './seek-command.service';

@Global()
@Module({
  controllers: [],
  providers: [SeekCommandService, SeekCommandExplorerService, MetadataScanner],
  exports: [SeekCommandService],
})
export class SeekCommandModule implements OnModuleInit {
  constructor(
    private readonly cliService: SeekCommandService,
    private readonly commandExplorerService: SeekCommandExplorerService
  ) {}

  onModuleInit() {
    this.cliService.initialize(this.commandExplorerService.explore());
  }
}
