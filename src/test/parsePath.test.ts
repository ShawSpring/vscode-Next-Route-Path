import {expect} from 'earl';

import {parseAppPath} from '../parsePath';
/**
 * just test parsePath
 */
describe(parseAppPath.name, () => {
  it('parsePath', () => {
    expect(parseAppPath('page.ts')).toEqual('');
    expect(parseAppPath('src/app/Page.ts')).toEqual(''); // case sensitive
    expect(parseAppPath('src/app/page.tsk')).toEqual('');
    expect(parseAppPath('src/app/page.json')).toEqual('');
    expect(parseAppPath('src/app/page.ts')).toEqual('/');
    expect(parseAppPath('src/app/page.tsx')).toEqual('/');
    expect(parseAppPath('src/app/page.js')).toEqual('/');
    expect(parseAppPath('app/page.jsx')).toEqual('/');
    // group routes
    expect(parseAppPath('app/(shop)/details/page.js')).toEqual('/details');
    expect(parseAppPath('app/invoices/(shop)/page.js')).toEqual('/invoices');
    expect(parseAppPath('app/invoices/sh(op)/page.js')).toEqual('/invoices/sh(op)');
    expect(parseAppPath('app/invoices/sh(xx)op/page.js')).toEqual('/invoices/sh(xx)op');
    expect(parseAppPath('app/invoices/(sh)op/page.js')).toEqual('/invoices/(sh)op');
    // parallel routes
    expect(parseAppPath('app/invoices/@team/page.js')).toEqual('/invoices');
    expect(parseAppPath('app/@team/invoices/page.js')).toEqual('/invoices');
    expect(parseAppPath('app/te@am/invoices/page.js')).toEqual('/te@am/invoices');
    //Dynamic routes
    expect(parseAppPath('app/shop/[slug]/category/page.js')).toEqual('/shop/[slug]/category');
    expect(parseAppPath('app/shop/[...slug]/page.js')).toEqual('/shop/[...slug]');
    expect(parseAppPath('app/shop/[[...slug]]/page.js')).toEqual('/shop/[[...slug]]');
    expect(parseAppPath('app/[categoryId]/[itemId]/page.js')).toEqual('/[categoryId]/[itemId]');
    // intercepting routes
    expect(parseAppPath('app/@auth/(.)login/page.tsx')).toEqual('/login');
    expect(parseAppPath('app/dashboard/@auth/(..)login/page.tsx')).toEqual('/login');
    expect(parseAppPath('app/dashboard/@auth/(..)/page.tsx')).toEqual('/dashboard/(..)');
    expect(parseAppPath('app/dashboard/teams/@auth/(...)login/page.tsx')).toEqual('/login');
    expect(parseAppPath('app/dashboard/teams/admin/@auth/(..)(..)login/page.tsx')).toEqual(
      '/dashboard/login'
    );
  });
});
