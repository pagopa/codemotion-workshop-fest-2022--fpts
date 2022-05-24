/* eslint-disable no-console */
/* eslint-disable extra-rules/no-commented-out-code */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";

// You can create an Option from a value
const someValue = O.some(42); // Some{42}

// from "nothing"
const nothing = O.none; // None

// or from a variable which can either contains a value or not.
const [foo, bar] = ["foo", null];
const maybeFoo = O.fromNullable(foo); // Some{"foo"}
const maybeBar = O.fromNullable(bar); // None

// You can access a value only when the Option is Some
if (O.isSome(maybeFoo)) {
  console.log(maybeFoo.value); // "foo"
} else {
  // @ts-expect-error expecting .value not to exist as the Option has been narrowed to None
  console.error(maybeFoo.value);
}

// You can apply a transformation on values using map(); transformation will be applied on Some instnces only
const toDouble = (n: number): number => n * 2;

O.map(toDouble)(someValue); // Some{84} (map applied)
O.map(toDouble)(nothing); // None (map did not apply)

// same result can be obtained using pipe() for composition
pipe(someValue, O.map(toDouble));
pipe(nothing, O.map(toDouble));

// allowing multiple transformations to be applied easy
pipe(
  someValue,
  O.map(toDouble),
  O.map(toDouble),
  O.map(toDouble),
  O.map(toDouble)
); // Some{672}

// When the transformation applied can result in something that can be Some or None, use chain()
const books = [
  { author: "Robert Martin", title: "Clean Code" },
  { author: "Martin Fowler", title: "Refactoring" }
];
const getAuthorOf = (query?: string): O.Option<string> =>
  pipe(
    query,
    O.fromNullable,
    O.map(q => books.find(e => e.title === q)),
    O.chain(O.fromNullable),
    O.map(x => x.author)
  );

getAuthorOf("Refactoring"); // Some{"Martin Fowler"}
getAuthorOf("A book about fp-ts"); // None
getAuthorOf(); // None

// To extract the value from the type class, use fold()
pipe(
  someValue,
  O.map(toDouble),
  O.fold(
    () => -1, // on None
    value => value // on Some
  )
); // 84
