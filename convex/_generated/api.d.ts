/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as cart from "../cart.js";
import type * as checkout from "../checkout.js";
import type * as downloads from "../downloads.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as router from "../router.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  cart: typeof cart;
  checkout: typeof checkout;
  downloads: typeof downloads;
  http: typeof http;
  migrations: typeof migrations;
  orders: typeof orders;
  products: typeof products;
  router: typeof router;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
