/**
 *  App Router pattern [see](https://nextjs.org/docs)
 * @param path relative to workspace root
 * @returns route pathname or empty string
 */
function parseAppPath(path: string): string {
  //  start with src/app/ or app/ && end with /page.ts
  const appRouterReg = /^(?:src\/)?app((?:\/.+)*)\/page.(tsx|jsx|js|ts)$/g;
  if (appRouterReg.test(path)) {
    path = path.replace(appRouterReg, '$1');
  } else {
    return ''; // Not Routable
  }

  // group routes
  const groupRouteReg = /\/\([^\/|^\.]+\)(?=\/|$)/;
  path = path.replace(groupRouteReg, '');
  //parallel routes
  const parallelRouteReg = /\/@([^\/|^\.]+)(?=\/|$)/;
  path = path.replace(parallelRouteReg, '');
  //intercepting routes
  path = path.replace(/(?<=\/)\(\.\)/, ''); //  \(.)
  path = path.replace(/[^\/]+\/\(\.\.\)(?=\w)/, ''); //
  path = path.replace(/.*\/\(\.\.\.\)/, '/'); //  \(...)
  path = path.replace(/([^/]+\/){2}\(\.\.\)\(\.\.\)/, ''); //  \(..)(..)

  return path || '/';
}
export {parseAppPath};
