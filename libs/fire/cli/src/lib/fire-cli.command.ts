import { SeekCommand, Positional, Option } from '@nxseek/command';
import { Injectable } from '@nestjs/common';
import { FireCliService } from './fire-cli.service';

@Injectable()
export class FireCliCommand {
  constructor(private readonly userService: FireCliService) {}

  @SeekCommand({
    command: 'create:user <username>',
    describe: 'create a user',
    /** defaults to `true`, but you can
     * use `false` if you need more control
     */
    autoExit: true,
  })
  async create(
    @Positional({
      name: 'username',
      describe: 'the username',
      type: 'string',
    })
    username: string,

    @Option({
      name: 'group',
      describe: 'user group (ex: "jedi")',
      type: 'string',
      alias: 'g',
      required: false,
    })
    group: string,

    @Option({
      name: 'saber',
      describe: 'if user has a lightsaber',
      type: 'boolean',
      default: false,
      required: false,
    })
    saber: boolean,
  ) {
    this.userService.add({
      username,
      group,
      saber,
    });
  }
}
