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
    expect(1).toEqual(1);
  });
});
