/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-console */
/* eslint-disable extra-rules/no-commented-out-code */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";

// You can create an Either from a value
TE.right(42); // () => Promise{Right{42}}
TE.left(42); // () => Promise{Left{42}}

// or by wrapping a promise
TE.tryCatch(
  () => Promise.resolve(42),
  () => new Error() // a Left value must be defined in case the promise rejects
); // () => Promise{Right{42}}

// or from an Either.
pipe(E.right(42), TE.fromEither); // () => Promise{Right{42}}
pipe(E.left(42), TE.fromEither); // () => Promise{Left{42}}

// TaskEither are lazy operations. That is, they are actually a function to be executed
const promise42 = TE.right(42)(); // Promise{Right{42}}
promise42.then(console.log); //  Right{42}
