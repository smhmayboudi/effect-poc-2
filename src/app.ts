import {Effect, Layer, pipe} from 'effect';
import {Express} from './express';
import {TodoController} from './todo/todo-controller';
import {TodoRepository} from './todo/todo-repository';
import {TodoService} from './todo/todo-service';
import {env} from './env';

const ExpressLive = pipe(
  env.server,
  Effect.map(({ip, port}) => Express.live(ip, port)),
  Layer.unwrapEffect
);

const AppLive = pipe(
  ExpressLive,
  Layer.merge(TodoService.live),
  Layer.provideMerge(TodoRepository.live)
);

pipe(
  TodoController,
  Effect.zipRight(Effect.never),
  Effect.provide(AppLive),
  Effect.tapErrorCause(Effect.logError),
  Effect.runFork
);
