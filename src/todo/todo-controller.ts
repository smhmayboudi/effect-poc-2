import {Effect, pipe} from 'effect';
import {TodoService} from './todo-service';
import * as bodyParser from 'body-parser';
import {Schema} from '@effect/schema';
import {del, get, post, put, use} from '../express';
import {
  TodoModelCreateParamsBO,
  TodoModelUpdateParamsBO,
} from './todo-model-index';
import {TodoId} from '../lib';

export const TodoController = Effect.all([
  // Deserialize the body as a JSON
  use((req, res, next) => Effect.sync(() => bodyParser.json()(req, res, next))),
  // GET `/todo/:id` route
  // - If the todo exists, return the todo as JSON
  // - If the todo does not exist return a 404 status code with the message `"Todo ${id} not found"`
  get('/todo/:id', (req, res) => {
    const id = Number(req.params.id);
    return pipe(
      TodoService,
      Effect.flatMap(service => service.getTodo(TodoId(id))),
      Effect.matchEffect({
        onFailure: () =>
          Effect.sync(() =>
            res.status(404).json({error: `todo ${id} not found.`})
          ),
        onSuccess: todo => Effect.sync(() => res.json(todo)),
        // onSuccess: todo =>
        //   Effect.sync(() => {
        //     const dto = Schema.decodeSync(TodoModelDTO.TransformFrom, {
        //       errors: 'all',
        //       propertyOrder: 'original',
        //       onExcessProperty: 'error',
        //       exact: true,
        //     })(todo);
        //     return res.json(dto);
        //   }),
        // onSuccess: todo =>
        //   pipe(
        //     Effect.succeed(todo),
        //     Effect.flatMap(
        //       Schema.decode(TodoModelDTO.TransformFrom, {
        //         errors: 'all',
        //         propertyOrder: 'original',
        //         onExcessProperty: 'error',
        //         exact: true,
        //       })
        //     ),
        //     Effect.matchEffect({
        //       onFailure: error =>
        //         Effect.sync(() => res.status(404).json({error})),
        //       onSuccess: todo => Effect.sync(() => res.json(todo)),
        //     })
        //   ),
      })
    );
  }),
  // GET `/todo` route
  // - Should return all todos from the `TodoService`
  get('/todo', (_, res) =>
    pipe(
      TodoService,
      Effect.flatMap(service => service.getTodos()),
      // Effect.map(map =>
      //   Array.fromIterable(map).map(dao =>
      //     Schema.decodeSync(TodoModelDTO.TransformFrom, {
      //       errors: 'all',
      //       propertyOrder: 'original',
      //       onExcessProperty: 'error',
      //       exact: true,
      //     })(dao)
      //   )
      // ),
      Effect.flatMap(todos => Effect.sync(() => res.json(todos)))
    )
  ),
  // POST `/todo` route
  // - Should create a new todo and return the todo ID in the response
  // - If the request JSON body is not valid return a 400 status code with the message `"Invalid todo"`
  post('/todo', (req, res) =>
    pipe(
      Schema.decodeUnknown(TodoModelCreateParamsBO.TransformFrom, {
        errors: 'all',
        propertyOrder: 'original',
        onExcessProperty: 'error',
        exact: true,
      })(req.body),
      Effect.matchEffect({
        onFailure: () =>
          Effect.sync(() => res.status(400).json({error: 'invalid todo.'})),
        onSuccess: todo =>
          pipe(
            TodoService,
            Effect.flatMap(service => service.createTodo(todo)),
            Effect.flatMap(id => Effect.sync(() => res.json(id)))
          ),
      })
    )
  ),
  // PUT `/todo/:id` route
  // - Should update an existing todo and return the updated todo as JSON
  // - If the request JSON body is not valid return a 400 status code with the message `"Invalid todo"`
  // - If the todo does not exist return a 404 with the message `"Todo ${id} not found"`
  put('/todo/:id', (req, res) => {
    const id = Number(req.params.id);
    return pipe(
      Schema.decodeUnknown(TodoModelUpdateParamsBO.TransformFrom)(req.body, {
        errors: 'all',
        propertyOrder: 'original',
        onExcessProperty: 'error',
        exact: true,
      }),
      Effect.matchEffect({
        onFailure: () =>
          Effect.sync(() => res.status(400).json({error: 'invalid todo.'})),
        onSuccess: todo =>
          pipe(
            TodoService,
            Effect.flatMap(service => service.updateTodo(TodoId(id), todo)),
            // Effect.flatMap(
            //   Schema.decode(TodoModelDTO.TransformFrom, {
            //     errors: 'all',
            //     propertyOrder: 'original',
            //     onExcessProperty: 'error',
            //     exact: true,
            //   })
            // ),
            Effect.matchEffect({
              onFailure: err =>
                Effect.sync(() =>
                  res
                    .status(404)
                    .json({error: `todo ${id} not found. ${err.message}`})
                ),
              onSuccess: todo => Effect.sync(() => res.json(todo)),
            })
          ),
      })
    );
  }),
  // DELETE `/todo/:id` route
  // - Should delete the todo by id and return a boolean indicating if a todo was deleted
  del('/todo/:id', (req, res) =>
    pipe(
      Effect.sync(() => Number(req.params.id)),
      Effect.zip(TodoService),
      Effect.flatMap(([id, service]) => service.deleteTodo(TodoId(id))),
      Effect.flatMap(deleted => Effect.sync(() => res.json({deleted})))
    )
  ),
]);
