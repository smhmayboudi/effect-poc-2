import {Context, Effect, Layer, pipe} from 'effect';
import {FeatureFlagError} from './error';
import * as fs from 'node:fs/promises';

class FeatureFlag extends Context.Tag('FeatureFlag')<
  FeatureFlag,
  {
    readonly isEnabled: (flag: string) => Effect.Effect<boolean, never, never>;
  }
>() {}

// A simple approach

export const mainFeatureFlagProgram = (flag: string) =>
  pipe(
    FeatureFlag,
    Effect.flatMap(({isEnabled}) => isEnabled(flag)),
    Effect.provideServiceEffect(
      FeatureFlag,
      pipe(
        Effect.promise(() => fetch(`/feature-flag/${flag}`)),
        Effect.map(({body}) => ({
          isEnabled: () =>
            Effect.succeed((body as any).isEnabled ? true : false),
        })),
        // the feature flag for all posible error become false.
        Effect.catchAll(() =>
          Effect.succeed({
            isEnabled: () => Effect.succeed(false),
          })
        )
      )
    ),
    Effect.runPromise
  );

// Another implementation

class ConfigFile extends Context.Tag('ConfigFile')<
  ConfigFile,
  {
    readonly contents: Record<string, boolean>;
  }
>() {}

const FeatureFlagLive = Layer.effect(
  FeatureFlag,
  pipe(
    ConfigFile,
    Effect.map(config => ({
      isEnabled: (flag: string) =>
        Effect.sync(() => config.contents[flag] ?? false),
    }))
  )
);

const ConfigFileLive = Layer.effect(
  ConfigFile,
  Effect.gen(function* (_) {
    const contents = yield* _(
      Effect.tryPromise({
        try: () => fs.readFile('config.json', 'utf-8'),
        catch: err =>
          new FeatureFlagError({message: `could not read config file. ${err}`}),
      })
    );
    const parsed = yield* _(
      Effect.try({
        try: () => JSON.parse(contents),
        catch: err =>
          new FeatureFlagError({
            message: `could not parse config file. ${err}`,
          }),
      })
    );

    return {
      contents: parsed,
    };
  })
);

const ConfigFetchLive = Layer.effect(
  ConfigFile,
  Effect.gen(function* (_) {
    const {body} = yield* _(
      Effect.tryPromise({
        try: () => fetch(`/feature-flag`),
        catch: err =>
          new FeatureFlagError({message: `could not fetch request. ${err}`}),
      })
    );
    const parsed = yield* _(
      Effect.try({
        try: () => JSON.parse(body as any),
        catch: err =>
          new FeatureFlagError({
            message: `could not parse body response. ${err}`,
          }),
      })
    );

    return {
      contents: parsed,
    };
  })
);

const mainFeatureFlagProgram2 = Layer.provide(FeatureFlagLive, ConfigFileLive);
const mainFeatureFlagProgram3 = Layer.provide(FeatureFlagLive, ConfigFetchLive);
