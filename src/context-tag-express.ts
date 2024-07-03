import {Context, Layer, Effect, Runtime} from 'effect';
import * as express from 'express';

// Define ContextTagExpress as a service
class ContextTagExpress extends Context.Tag('Express')<
  ContextTagExpress,
  ReturnType<typeof express>
>() {}

// Define the main route, IndexRouteLive, as a Layer
const IndexRouteLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const app = yield* ContextTagExpress;
    const runFork = Runtime.runFork(yield* Effect.runtime());
    app.get('/', (_, res) => {
      runFork(Effect.sync(() => res.send('Hello World!')));
    });
  })
);

// Server Setup
const ServerLive = Layer.scopedDiscard(
  Effect.gen(function* () {
    const port = 3001;
    const app = yield* ContextTagExpress;
    yield* Effect.acquireRelease(
      Effect.sync(() =>
        app.listen(port, () =>
          console.log(`Example app listening on port ${port}`)
        )
      ),
      server => Effect.sync(() => server.close())
    );
  })
);

// Setting Up Express
const ExpressLive = Layer.sync(ContextTagExpress, () => express());

// Combine the layers
const AppLive = ServerLive.pipe(
  Layer.provide(IndexRouteLive),
  Layer.provide(ExpressLive)
);

// Run the program
Effect.runFork(Layer.launch(AppLive));
