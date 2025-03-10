import {Effect, Context, Layer, Console} from 'effect';
import * as Services from './Services';
import * as Workspace from './Workspace';
// The `FailureCaseLiterals` type allows us to provide different error scenarios while testing our services.
// For example, by providing the value "S3", we can simulate an error scenario specific to the S3 service.
// This helps us ensure that our program handle errors correctly and behave as expected in various situations.
// Similarly, we can provide other values like "ElasticSearch" or "Database" to simulate error scenarios for those services.
// In cases where we want to test the absence of errors, we can provide `undefined`.
// By using this parameter, we can thoroughly test our services and verify their behavior under different error conditions.
type FailureCaseLiterals = 'S3' | 'ElasticSearch' | 'Database' | undefined;
class FailureCase extends Context.Tag('FailureCase')<
  FailureCase,
  FailureCaseLiterals
>() {}
// Create a test layer for the S3 service
const S3Test = Layer.effect(
  Services.S3,
  Effect.andThen(FailureCase, failureCase => ({
    createBucket: Console.log('[S3] creating bucket').pipe(
      Effect.andThen(
        failureCase === 'S3'
          ? Effect.fail(new Services.S3Error())
          : Effect.succeed({name: '<bucket.name>'})
      )
    ),
    deleteBucket: bucket => Console.log(`[S3] delete bucket ${bucket.name}`),
  }))
);
// Create a test layer for the ElasticSearch service
const ElasticSearchTest = Layer.effect(
  Services.ElasticSearch,
  Effect.andThen(FailureCase, failureCase => ({
    createIndex: Console.log('[ElasticSearch] creating index').pipe(
      Effect.andThen(
        failureCase === 'ElasticSearch'
          ? Effect.fail(new Services.ElasticSearchError())
          : Effect.succeed({id: '<index.id>'})
      )
    ),
    deleteIndex: index =>
      Console.log(`[ElasticSearch] delete index ${index.id}`),
  }))
);
// Create a test layer for the Database service
const DatabaseTest = Layer.effect(
  Services.Database,
  Effect.andThen(FailureCase, failureCase => ({
    createEntry: (bucket, index) =>
      Console.log(
        `[Database] creating entry for bucket ${bucket.name} and index ${index.id}`
      ).pipe(
        Effect.andThen(
          failureCase === 'Database'
            ? Effect.fail(new Services.DatabaseError())
            : Effect.succeed({id: '<entry.id>'})
        )
      ),
    deleteEntry: entry => Console.log(`[Database] delete entry ${entry.id}`),
  }))
);
// Merge all the test layers for S3, ElasticSearch, and Database services into a single layer
const layer = Layer.mergeAll(S3Test, ElasticSearchTest, DatabaseTest);
// Create a runnable effect to test the Workspace code
// The effect is provided with the test layer and a FailureCase service with undefined value (no failure case)
const runnable = Workspace.make.pipe(
  Effect.provide(layer),
  // Effect.provideService(FailureCase, undefined)
  // Effect.provideService(FailureCase, 'Database')
  // Effect.provideService(FailureCase, 'ElasticSearch')
  Effect.provideService(FailureCase, 'S3')
);
Effect.runPromise(Effect.either(runnable)).then(console.log);
