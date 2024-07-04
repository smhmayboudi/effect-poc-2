import {Effect, Layer, pipe} from 'effect';
import * as Exp from './express';
import {TodoRoute} from './todo/todo-route';
import {TodoRepository} from './todo/todo-repository';

const AppLive = pipe(
  Exp.Live('127.0.0.1', 8888),
  Layer.merge(TodoRepository.Live)
);

pipe(
  TodoRoute,
  Effect.zipRight(Effect.never),
  Effect.provide(AppLive),
  Effect.tapErrorCause(Effect.logError),
  Effect.runFork
);
