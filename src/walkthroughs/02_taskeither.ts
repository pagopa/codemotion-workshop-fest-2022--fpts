/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
/* eslint-disable extra-rules/no-commented-out-code */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";

/**
 * Costruire un TaskEither
 */
TE.right(42);
TE.left("not 42");

TE.tryCatch(
  () => Promise.resolve(42),
  failure => new Error("unknown failure")
);

declare function myExternalPaymentService(): Promise<unknown>;
const processPayment = async (price: number): Promise<unknown> =>
  myExternalPaymentService();

const checkMinPrice = (price: number): E.Either<string, number> =>
  price >= 10 // arbitrary treshold, just an example
    ? E.right(price)
    : E.left("price cannot be less than 10");
const applyDiscount = (perc: number) => (n: number): number =>
  n * (1 - perc / 100);
const toEuro = (n: number): string => `$${n}`;

const validatePrice = (price: number): E.Either<string, number> =>
  price >= 0 ? E.right(price) : E.left("price cannot be negative");

declare const myPrice: number;
const procedure = pipe(
  myPrice,
  validatePrice,
  E.map(applyDiscount(30)),
  E.chain(checkMinPrice),
  TE.fromEither,
  TE.chain(actualPrice =>
    TE.tryCatch(
      () => processPayment(actualPrice),
      err => "è successo qualcosa durante il pagamento"
    )
  ),
  TE.map(_ => "OK"),
  // questo fold è sostituito da TE.toUnion
  TE.fold(
    _ => async () => _,
    _ => async () => _
  )
);

procedure().then(result => {
  console.log(result);
});
