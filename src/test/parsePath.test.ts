import {expect} from 'earl';

import parsePath from '../parsePath';
/**
 * just test parsePath
 */

describe('parsePath App Router', () => {
  it('page.tsx', () => {
    expect(parsePath('page.ts')).toEqual('');
    expect(parsePath('src/app/Page.ts')).toEqual(''); // case sensitive
    expect(parsePath('src/app/page.tsk')).toEqual('');
    expect(parsePath('src/app/page.json')).toEqual('');
    expect(parsePath('src/app/page.ts')).toEqual('/');
    expect(parsePath('src/app/page.tsx')).toEqual('/');
    expect(parsePath('src/app/page.js')).toEqual('/');
    expect(parsePath('app/page.jsx')).toEqual('/');
  });
  it('route handles', () => {
    expect(parsePath('app/route.tsx')).toEqual(''); //  can't be '/',cuz it conflict with app/page.tsx
    expect(parsePath('app/api/route.jsx')).toEqual('/api');
    expect(parsePath('store/items/route.jsx')).toEqual('');
    expect(parsePath('src/app/store/items/route.jsx')).toEqual('/store/items');
  });
  // group routes
  it('group routes', () => {
    expect(parsePath('app/(shop)/details/page.js')).toEqual('/details');
    expect(parsePath('app/invoices/(shop)/page.js')).toEqual('/invoices');
    expect(parsePath('app/invoices/sh(op)/page.js')).toEqual('/invoices/sh(op)');
    expect(parsePath('app/invoices/sh(xx)op/page.js')).toEqual('/invoices/sh(xx)op');
    expect(parsePath('app/invoices/(sh)op/page.js')).toEqual('/invoices/(sh)op');
  });
  // parallel routes
  it('parallel routes', () => {
    expect(parsePath('app/invoices/@team/page.js')).toEqual('/invoices');
    expect(parsePath('app/@team/invoices/page.js')).toEqual('/invoices');
    expect(parsePath('app/te@am/invoices/page.js')).toEqual('/te@am/invoices');
  });
  //Dynamic routes
  it('Dynamic routes', () => {
    expect(parsePath('app/shop/[slug]/category/page.js')).toEqual('/shop/[slug]/category');
    expect(parsePath('app/shop/[...slug]/page.js')).toEqual('/shop/[...slug]');
    expect(parsePath('app/shop/[[...slug]]/page.js')).toEqual('/shop/[[...slug]]');
    expect(parsePath('app/[categoryId]/[itemId]/page.js')).toEqual('/[categoryId]/[itemId]');
    expect(parsePath('app/category/[itemId]/[id].js')).toEqual('');
  });
  // intercepting routes
  it('intercepting routes', () => {
    expect(parsePath('app/@auth/(.)login/page.tsx')).toEqual('/login');
    expect(parsePath('app/dashboard/@auth/(..)login/page.tsx')).toEqual('/login');
    expect(parsePath('app/dashboard/@auth/(..)/page.tsx')).toEqual('/dashboard/(..)');
    expect(parsePath('app/dashboard/teams/@auth/(...)login/page.tsx')).toEqual('/login');
    expect(parsePath('app/dashboard/teams/admin/@auth/(..)(..)login/page.tsx')).toEqual(
      '/dashboard/login'
    );
  });
});

describe('parsePath pages router', () => {
  it('index page', () => {
    expect(parsePath('pages/index.tsx')).toEqual('/');
    expect(parsePath('src/pages/index.js')).toEqual('/');
    expect(parsePath('pages/index.json')).toEqual('');
    expect(parsePath('pages/page.tsx')).toEqual('/page');
  });
  it('outer of pages', () => {
    expect(parsePath('src/about.tsx')).toEqual('');
    expect(parsePath('components/about.tsx')).toEqual('');
    expect(parsePath('app/about.tsx')).toEqual('');
    expect(parsePath('about.tsx')).toEqual('');
  });
  it('pages/api', () => {
    expect(parsePath('pages/api/hello.ts')).toEqual('/api/hello');
    expect(parsePath('api/hello.ts')).toEqual('');
  });
  it('case insensitive', () => {
    expect(parsePath('pages/customers.tsx')).toEqual('/customers');
    expect(parsePath('pages/Customers.tsx')).toEqual('/Customers');
    expect(parsePath('pages/custoMers.tsx')).toEqual('/custoMers');
  });
});
