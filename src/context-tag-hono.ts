import {Context, Layer, Effect, Runtime} from 'effect';
import {Hono} from 'hono';
import {serve} from '@hono/node-server';

// Define ContextTag as a service
class ContextTagHono extends Context.Tag('Hono')<ContextTagHono, Hono>() {}

// Define the main route, IndexRouteLive, as a Layer
const IndexRouteLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const app = yield* ContextTagHono;
    const runSync = Runtime.runSync(yield* Effect.runtime());
    app.get('/', ctx => {
      // return ctx.text('Hello World!');
      return runSync(Effect.sync(() => ctx.text('Hello World!')));
    });
  })
);

// Server Setup
const ServerLive = Layer.scopedDiscard(
  Effect.gen(function* () {
    const port = 3001;
    const app = yield* ContextTagHono;
    yield* Effect.acquireRelease(
      Effect.sync(() =>
        serve({...app, port}, ({port}) => {
          console.log(`Example app listening on port ${port}`);
        })
      ),
      server => Effect.sync(() => server.close())
    );
  })
);

// Setting Up Hono
const HonoLive = Layer.sync(ContextTagHono, () => new Hono());

// Combine the layers
const AppLive = ServerLive.pipe(
  Layer.provide(IndexRouteLive),
  Layer.provide(HonoLive)
);

// Run the program
Effect.runFork(Layer.launch(AppLive));
