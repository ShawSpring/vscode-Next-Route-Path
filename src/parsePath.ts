export default function parsePath(path: string): string {
  //  start with src/app/ or app/ && end with /page.ts
  const appRouterPageReg = /^(?:src\/)?app((?:\/.+)*)\/page.(tsx|jsx|js|ts)$/;
  // don't need to be contained in the 'api' folder
  const appRouteHandleReg = /^(?:src\/)?app((?:\/.+)*)\/route.(tsx|jsx|js|ts)$/;
  // App Router takes priority
  if (appRouterPageReg.test(path)) {
    path = path.replace(appRouterPageReg, '$1');
    return parseAppPath(path) || '/';
  } else if (appRouteHandleReg.test(path)) {
    path = path.replace(appRouteHandleReg, '$1');
    return path;
  }

  const pagesReg = /^(?:src\/)?pages((\/.+)*)\.(tsx|jsx|js|ts)$/;
  if (pagesReg.test(path)) {
    path = path.replace(pagesReg, '$1');
    return parsePagesPath(path) || '/';
  }

  return ''; // Not Routable
}

/**
 *  App Router pattern [see](https://nextjs.org/docs)
 * @param path relative to workspace root
 * @returns route pathname or empty string
 */
function parseAppPath(path: string): string {
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

  return path;
}

/**
 *  App Router pattern [see](https://nextjs.org/docs)
 * @param path relative to workspace root
 * @returns route pathname or empty string
 */
function parsePagesPath(path: string): string {
  // index page
  path = path.replace(/\/index$/, '');
  return path;
}

function test() {
  const strs = [
    'pages/index.tsx',
    'pages/blog/index.js',
    'pages/blog/itemindex.js',
    'pages/blog/first-post.js',
    'pages/dashboard/settings/user.name.js',
    'pages/blog/[slug].js',
    'pages/shop/[...slug].js',
    'pages/shop/[[...slug]].js',
    'pages/api/hello.js',
    'pages/Customers.tsx',
  ];
  strs.forEach((str) => {
    console.log(str, '  =>  ', parsePath(str));
  });
}

test();
