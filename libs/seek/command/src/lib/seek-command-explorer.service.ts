import compact from 'lodash.compact';
import flattenDeep from 'lodash.flattendeep';
import { CommandModule, Argv } from 'yargs';
import { Injectable } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { Injectable as InjectableInterface } from '@nestjs/common/interfaces';
import {
  COMMAND_HANDLER_METADATA,
  SeekCommandMetadata,
  SeekCommandParamTypes,
  SeekCommandParamMetadata,
  SeekCommandOptionsOption,
  CommnadPositionalOption,
  SeekCommandParamMetadataItem
} from './seek-command.decorator';
import { SeekCommandService } from './seek-command.service';

@Injectable()
export class SeekCommandExplorerService {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly commandService: SeekCommandService
  ) {}

  explore(): CommandModule[] {
    const components = [...this.modulesContainer.values()].map(
      module => module.components
    );

    return compact(
      flattenDeep<CommandModule>(
        components.map(component =>
          [...component.values()].map(({ instance, metatype }) =>
            this.filterSeekCommands(instance, metatype)
          )
        )
      )
    );
  }

  protected filterSeekCommands(instance: InjectableInterface, metatype: any) {
    if (!instance) return;

    const prototype = Object.getPrototypeOf(instance);
    const components = this.metadataScanner.scanFromPrototype(
      instance,
      prototype,
      name => this.extractMetadata(instance, prototype, name)
    );

    return components
      .filter(command => !!command.metadata)
      .map<CommandModule>(command => {
        const exec = instance[command.methodName].bind(instance);
        const builder = (yargs: Argv) => {
          return this.generateSeekCommandBuilder(command.metadata.params, yargs);
        }; // EOF builder

        const handler = async (argv: any) => {
          const params = this.generateSeekCommandHandlerParams(
            command.metadata.params,
            argv
          );

          this.commandService.run();
          const code = await exec(...params);
          command.metadata.option.autoExit &&
            this.commandService.exit(code || 0);
        };

        return {
          ...command.metadata.option,
          builder,
          handler
        };
      });
  }

  protected extractMetadata(instance, prototype, methodName: string) {
    const callback = prototype[methodName];
    const metadata: SeekCommandMetadata = Reflect.getMetadata(
      COMMAND_HANDLER_METADATA,
      callback
    );

    return {
      methodName,
      metadata
    };
  }

  protected iteratorParamMetadata<O>(
    params: SeekCommandParamMetadata<O>,
    callback: (item: SeekCommandParamMetadataItem<O>, key: string) => void
  ) {
    if (!params) {
      return;
    }

    Object.keys(params).forEach(key => {
      const param: SeekCommandParamMetadataItem<O>[] = params[key];
      if (!param || !Array.isArray(param)) {
        return;
      }

      param.forEach(metadata => callback(metadata, key));
    });
  }

  private generateSeekCommandHandlerParams(
    params: SeekCommandParamMetadata<
      SeekCommandOptionsOption | CommnadPositionalOption
    >,
    argv: any
  ) {
    const list = [];

    this.iteratorParamMetadata(params, (item, key) => {
      switch (key) {
        case SeekCommandParamTypes.OPTION:
          list[item.index] = argv[(item.option as SeekCommandOptionsOption).name];
          break;

        case SeekCommandParamTypes.POSITIONAL:
          list[item.index] =
            argv[(item.option as CommnadPositionalOption).name];
          break;

        case SeekCommandParamTypes.ARGV:
          list[item.index] = argv;

        default:
          break;
      }
    });

    return list;
  }

  private generateSeekCommandBuilder(
    params: SeekCommandParamMetadata<
      SeekCommandOptionsOption | CommnadPositionalOption
    >,
    yargs: Argv
  ) {
    this.iteratorParamMetadata(params, (item, key) => {
      switch (key) {
        case SeekCommandParamTypes.OPTION:
          yargs.option(
            (item.option as SeekCommandOptionsOption).name,
            item.option as SeekCommandOptionsOption
          );
          break;

        case SeekCommandParamTypes.POSITIONAL:
          yargs.positional(
            (item.option as CommnadPositionalOption).name,
            item.option as CommnadPositionalOption
          );
          break;

        default:
          break;
      }
    });

    return yargs;
  }
}
