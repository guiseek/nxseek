import 'reflect-metadata';
import { SetMetadata } from '@nestjs/common';
import { PositionalOptions, Options } from 'yargs';

export const COMMAND_HANDLER_METADATA = '__command-handler-metadata__';
export const COMMAND_ARGS_METADATA = '__command-args-metadata__';
export enum SeekCommandParamTypes {
  POSITIONAL = 'POSITIONAL',
  OPTION = 'OPTION',
  ARGV = 'ARGV'
}

export type SeekCommandParamMetadata<O> = {
  [type in SeekCommandParamTypes]: SeekCommandParamMetadataItem<O>[]
};
export interface SeekCommandParamMetadataItem<O> {
  index: number;
  option: O;
}
const createSeekCommandParamDecorator = <O>(paramtype: SeekCommandParamTypes) => {
  return (option?: O): ParameterDecorator => (target, key, index) => {
    const params =
      Reflect.getMetadata(COMMAND_ARGS_METADATA, target[key]) || {};
    Reflect.defineMetadata(
      COMMAND_ARGS_METADATA,
      {
        ...params,
        [paramtype]: [...(params[paramtype] || []), { index, option }]
      },
      target[key]
    );
  };
};

export interface SeekCommandMetadata {
  params: SeekCommandParamMetadata<CommnadPositionalOption | SeekCommandOptionsOption>;
  option: SeekCommandOption;
}
export interface SeekCommandOption {
  aliases?: string[] | string;
  command: string[] | string;
  describe?: string | false;
  autoExit?: boolean;
}
export function SeekCommand(option: SeekCommandOption): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    if (option && typeof option.autoExit !== 'boolean') {
      option.autoExit = true;
    }

    const metadata: SeekCommandMetadata = {
      params: Reflect.getMetadata(COMMAND_ARGS_METADATA, descriptor.value),
      option
    };

    SetMetadata(COMMAND_HANDLER_METADATA, metadata)(target, key, descriptor);
  };
}
export interface CommnadPositionalOption extends PositionalOptions {
  name: string;
}
export const Positional = createSeekCommandParamDecorator<CommnadPositionalOption>(
  SeekCommandParamTypes.POSITIONAL
);

export interface SeekCommandOptionsOption extends Options {
  name: string;
}
export const Option = createSeekCommandParamDecorator<SeekCommandOptionsOption>(
  SeekCommandParamTypes.OPTION
);

export const Argv = createSeekCommandParamDecorator(SeekCommandParamTypes.ARGV);
