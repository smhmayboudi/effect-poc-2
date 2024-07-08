import {Config, pipe} from 'effect';

const IP = pipe(
  Config.string('IP'),
  Config.validate({
    message: 'must be a string with IPv4 format.',
    validation: ip =>
      /^(?:\b\.?(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){4}$/.test(ip),
  }),
  Config.withDefault('127.0.0.1')
);
const PORT = pipe(
  Config.number('PORT'),
  Config.validate({
    message: 'must be a number between 1024 to 65536.',
    validation: port => 1024 < port && port < 65536,
  }),
  Config.withDefault(8888)
);

const server = Config.nested(
  Config.all({
    ip: IP,
    port: PORT,
  }).pipe(
    Config.map(({ip, port}) => ({
      ip,
      port,
    }))
  ),
  'SERVER'
);

export const env = {
  server: server,
};
