import {Config, LogLevel, pipe} from 'effect';

const level = pipe(
  Config.logLevel('LEVEL'),
  Config.validate({
    message: 'must be one of fatal | error | warning | info | debug | trace.',
    validation: level =>
      /^(FATAL|ERROR|WARNING|INFO|DEBUG|TRACE)$/.test(level.label),
  }),
  Config.withDefault(LogLevel.Trace)
);

export const log = Config.nested(
  Config.all({level}).pipe(Config.map(({level}) => ({level}))),
  'LOG'
);
