/* eslint-disable no-console */
/* eslint-disable extra-rules/no-commented-out-code */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";

/**
 * Costruire un Either
 */
E.right(42);
E.left("not 42");

const validatePrice = (price: number): E.Either<string, number> =>
  price >= 0 ? E.right(price) : E.left("price cannot be negative");

/**
 * Usare gli smart constructor
 */
pipe(
  O.some(42),
  E.fromOption(() => "cannot handle null-ish values")
);

E.tryCatch(
  () => JSON.parse('{"baz":true}'),
  exception => new Error()
);

/**
 * type narrowing
 */
const fooOrError = E.right("foo");

if (E.isRight(fooOrError)) {
  console.log(fooOrError.right);
  // @ts-expect-error: left non è definito per Right
  console.log(fooOrError.left);
} else {
  console.log(fooOrError.left);
  // @ts-expect-error: right non è definito per Left
  console.log(fooOrError.right);
}

/**
 * usare map(), chain() e fold()
 */
const checkMinPrice = (price: number): E.Either<string, number> =>
  price >= 10 // arbitrary treshold, just an example
    ? E.right(price)
    : E.left("price cannot be less than 10");
const applyDiscount = (perc: number) => (n: number): number =>
  n * (1 - perc / 100);
const toEuro = (n: number): string => `$${n}`;

declare const myPrice: number;
pipe(
  myPrice,
  validatePrice,
  E.map(applyDiscount(23)),
  E.chain(checkMinPrice),
  E.foldW(reason => new Error(reason), toEuro)
);

/**
 * mapLeft()
 */
pipe(
  myPrice,
  validatePrice,
  E.mapLeft(failure => new Error(`Validation error: ${failure}`)),
  E.map(applyDiscount)
);

// problema: gestione di errori multipli
pipe(
  1, // checkMinPrice fallirà
  validatePrice,
  E.mapLeft(failure => new Error(failure)),
  E.chainW(checkMinPrice),
  E.mapLeft(failure => {
    //    ^^^ Error | string
    // failure può arrivare sia da validatePrice che da checkMinPrice
  })
);

// soluzione: nested pipe
pipe(
  1,
  validatePrice,
  E.mapLeft(failure => new Error(failure)),
  E.chainW(price =>
    pipe(
      price,
      checkMinPrice,
      E.mapLeft(failure => {
        //      ^^^ failure può arrivare SOLO da checkMinPrice
      })
    )
  )
);
