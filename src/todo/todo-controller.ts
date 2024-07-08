import {Effect, Option, pipe} from 'effect';
import {TodoService} from './todo-service';
import * as bodyParser from 'body-parser';
import {Schema} from '@effect/schema';
import {del, get, post, put, use} from '../express';
import {TodoCreateParams, TodoId, TodoUpdateParams} from './todo-model';

export const TodoController = Effect.all([
  // Deserialize the body as a JSON
  use((req, res, next) => Effect.sync(() => bodyParser.json()(req, res, next))),
  // GET `/todo/:id` route
  // - If the todo exists, return the todo as JSON
  // - If the todo does not exist return a 404 status code with the message `"Todo ${id} not found"`
  get('/todo/:id', (req, res) => {
    const id: number = req.params.id;
    return pipe(
      TodoService,
      Effect.flatMap(service => service.getTodo(TodoId(id))),
      Effect.flatMap(
        Option.match({
          onNone: () =>
            Effect.sync(() => res.status(404).json(`Todo ${id} not found`)),
          onSome: todo => Effect.sync(() => res.json(todo)),
        })
      )
    );
  }),
  // GET `/todo` route
  // - Should return all todos from the `TodoService`
  get('/todo', (_, res) =>
    pipe(
      TodoService,
      Effect.flatMap(service => service.getTodos()),
      Effect.flatMap(todos => Effect.sync(() => res.json(todos)))
    )
  ),
  // POST `/todo` route
  // - Should create a new todo and return the todo ID in the response
  // - If the request JSON body is not valid return a 400 status code with the message `"Invalid todo"`
  post('/todo', (req, res) => {
    const decodeBody = Schema.decodeUnknown(TodoCreateParams);
    return pipe(
      TodoService,
      Effect.flatMap(service =>
        pipe(
          decodeBody(req.body),
          Effect.matchEffect({
            onFailure: () =>
              Effect.sync(() => res.status(400).json('Invalid Todo')),
            onSuccess: todo =>
              pipe(
                service.createTodo(todo),
                Effect.flatMap(id => Effect.sync(() => res.json(id)))
              ),
          })
        )
      )
    );
  }),
  // PUT `/todo/:id` route
  // - Should update an existing todo and return the updated todo as JSON
  // - If the request JSON body is not valid return a 400 status code with the message `"Invalid todo"`
  // - If the todo does not exist return a 404 with the message `"Todo ${id} not found"`
  put('/todo/:id', (req, res) => {
    const id: number = req.params.id;
    const decodeBody = Schema.decodeUnknown(TodoUpdateParams);
    return pipe(
      TodoService,
      Effect.flatMap(service =>
        pipe(
          decodeBody(req.body),
          Effect.matchEffect({
            onFailure: () =>
              Effect.sync(() => res.status(400).json('Invalid todo')),
            onSuccess: todo =>
              pipe(
                service.updateTodo(TodoId(id), todo),
                Effect.matchEffect({
                  onFailure: err =>
                    Effect.sync(() =>
                      res
                        .status(404)
                        .json(`Todo ${id} not found: ${err.message}`)
                    ),
                  onSuccess: todo => Effect.sync(() => res.json(todo)),
                })
              ),
          })
        )
      )
    );
  }),
  // DELETE `/todo/:id` route
  // - Should delete the todo by id and return a boolean indicating if a todo was deleted
  del('/todo/:id', (req, res) => {
    const id: number = req.params.id;
    return pipe(
      TodoService,
      Effect.flatMap(service => service.deleteTodo(TodoId(id))),
      Effect.flatMap(deleted => Effect.sync(() => res.json({deleted})))
    );
  }),
]);
