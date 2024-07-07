import {Effect, Layer, pipe} from 'effect';
import {Express} from './express';
import {TodoRoute} from './todo/todo-route';
import {TodoRepository} from './todo/todo-repository';
import {TodoService} from './todo/todo-service';

const AppLive = pipe(
  Express.Live('127.0.0.1', 8888),
  Layer.merge(TodoService.Live),
  Layer.provideMerge(TodoRepository.Live)
);

pipe(
  TodoRoute,
  Effect.zipRight(Effect.never),
  Effect.provide(AppLive),
  Effect.tapErrorCause(Effect.logError),
  Effect.runFork
);
