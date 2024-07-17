import {Effect, Layer, Logger, pipe} from 'effect';
import {Express} from './express';
import {TodoController} from './todo/todo-controller';
import {TodoRepository} from './todo/todo-repository';
import {TodoService} from './todo/todo-service';
import env from './env-index';

const LogLevelLive = pipe(
  env.log,
  Effect.andThen(({level}) => Logger.minimumLogLevel(level)),
  Layer.unwrapEffect
);

const ExpressLive = pipe(
  env.server,
  Effect.map(({ip, port}) => Express.live(ip, port)),
  Layer.unwrapEffect
);

const AppLive = pipe(
  LogLevelLive,
  Layer.merge(ExpressLive),
  Layer.merge(TodoService.live),
  Layer.provideMerge(TodoRepository.live)
);

pipe(
  TodoController,
  Effect.zipRight(Effect.never),
  Effect.provide(AppLive),
  Effect.tapErrorCause(Effect.logError),
  Effect.provide(Logger.json),
  Effect.runFork
);
