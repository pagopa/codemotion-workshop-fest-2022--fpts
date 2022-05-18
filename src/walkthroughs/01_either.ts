/* eslint-disable no-console */
/* eslint-disable extra-rules/no-commented-out-code */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";

// You can create an Either from a value
const rightValue = E.right(42); // Right{42}
const leftValue = E.left(42); // Left{42}

// or from an Option. In this case, you have to tell what's the Left value when the Option is None
const [foo, bar] = ["foo", null];
const fooOrError = pipe(
  O.fromNullable(foo),
  E.fromOption(() => new Error())
); // Right{"foo"}
const barOrError = pipe(
  O.fromNullable(bar),
  E.fromOption(() => new Error())
); // Left{Error}

// Value is stored into the .right property for Right instances
if (E.isRight(fooOrError)) {
  console.log(fooOrError.right); // "foo"
  // @ts-expect-error .left cannot be accessed if the Either is right
  console.log(fooOrError.left);
}
// and in .left property for Left instances
else {
  console.log(fooOrError.left); // Error
  // @ts-expect-error .right cannot be accessed if the Either is Left
  console.log(fooOrError.right);
}

// As for Option, you can apply map(), chain() and fold()