/* eslint-disable import/no-extraneous-dependencies */
import { pathToFileURL } from 'node:url';

import { resolve as resolveTs } from 'ts-node/esm';
import * as tsConfigPaths from 'tsconfig-paths';

import type { NodeLoaderHooksAPI1 } from 'ts-node';

const result = tsConfigPaths.loadConfig();

if (result.resultType === 'failed') {
  throw new Error(result.message);
}

const { absoluteBaseUrl, paths } = result;
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths);

type TContext = Parameters<NodeLoaderHooksAPI1['resolve']>[1];
type TDefaultResolve = Parameters<NodeLoaderHooksAPI1['resolve']>[2];

export async function resolve(
  specifier: string,
  context: TContext,
  defaultResolve: TDefaultResolve,
) {
  const match = matchPath(specifier);

  return match === undefined
    ? resolveTs(specifier, context, defaultResolve)
    : resolveTs(pathToFileURL(match).href, context, defaultResolve);
}

export { load, transformSource } from 'ts-node/esm';
