/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable extra-rules/no-commented-out-code */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";

/**
 * Il modo più elementare di costruire un `Option` è usare gli appositi costruttori:
 */
O.some(42);
O.none;
declare const myVar: object;
O.some(myVar);

/**
 * Construire un `Option` usando fromNullable
 */
O.fromNullable(myVar); // Option<object>

/**
 * Type narrowing con isNone e isSome
 */
const maybeFoo = O.some("foo");

// @ts-expect-error: value non è definito per Option<string>
maybeFoo.value;

if (O.isSome(maybeFoo)) {
  console.log(maybeFoo.value); // "foo"
} else {
  //  @ts-expect-error: value non è definito per None
  console.error(maybeFoo.value);
}

/**
 * Usare map()
 */
const toEuro = (n: number): string => `$${n}`;
pipe(
  42,
  O.some,
  O.map(toEuro),
  O.map(value => {
    console.log(value); // "€42"
  })
);

const applyDiscount = (perc: number) => (n: number): number =>
  n * (1 - perc / 100);
const toRounded = (digits: number) => (n: number): number =>
  Math.round(n * 10 ** digits) / 10 ** digits;

declare const myPrice: number | undefined;
pipe(
  myPrice,
  O.fromNullable,
  O.map(applyDiscount(35)),
  O.map(toRounded(2)),
  O.map(toEuro)
);

/**
 * Usare chain
 */
type Product = { readonly name: string; readonly price: number };
const products = new Map<string, Product>();

const getFinalPrice = (productId: string): O.Option<string> =>
  pipe(
    productId,
    O.fromPredicate(s => s.length > 0),
    O.chain(id => {
      const product = products.get(id);
      return product ? O.some(product) : O.none;
      // o meglio: O.fromNullable(product)
    }),
    O.map(product => product.price),
    O.map(applyDiscount(35)),
    O.map(toRounded(2)),
    O.map(toEuro)
  );

/**
 * Utilizzare fold()
 */
declare const myProductId: string;
pipe(
  myProductId,
  getFinalPrice,
  O.fold(
    () => "Cannot find product, sorry :(",
    price => `You will pay ${price}`
  ),
  console.log // Domanda: cosa scrive sul log?
);
