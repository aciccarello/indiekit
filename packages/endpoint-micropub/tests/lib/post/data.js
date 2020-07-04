import test from 'ava';
import {JekyllConfig} from '../../../../config-jekyll/index.js';
import {postData} from '../../../lib/post/data.js';

test.beforeEach(t => {
  t.context = {
    publication: {
      config: new JekyllConfig().config,
      me: 'https://website.example',
      posts: {
        get: async key => ({
          type: 'note',
          path: 'foo',
          url: key,
          mf2: {
            properties: {
              content: ['hello world'],
              published: ['2019-08-17T23:56:38.977+01:00'],
              category: ['foo', 'bar'],
              slug: ['baz']
            }
          }
        })
      }
    },
    url: 'https://website.example/foo'
  };
});

test('Creates post data', t => {
  const mf2 = {
    type: 'h-entry',
    properties: {
      name: ['foo']
    }
  };
  const result = postData.create(t.context.publication, mf2);
  t.is(result.type, 'note');
  t.truthy(result.mf2.properties.published[0]);
  t.is(result.mf2.properties.slug[0], 'foo');
  t.truthy(result.mf2.properties);
});

test('Throws error creating post data without source microformats', t => {
  const error = t.throws(() => postData.create(t.context.publication, false));
  t.regex(error.message, /\bCannot destructure property\b/);
});

test('Reads post data', async t => {
  const result = await postData.read(t.context.publication, t.context.url);
  t.is(result.type, 'note');
});

test('Throws error reading post data', async t => {
  const error = await t.throwsAsync(
    postData.read(false, t.context.url)
  );
  t.is(error.message, 'Cannot read property \'get\' of undefined');
});

test('Updates post by adding properties', async t => {
  const operation = {add: {syndication: ['http://website.example']}};
  const result = await postData.update(t.context.publication, t.context.url, operation);
  t.truthy(result.mf2.properties.syndication);
});

test('Updates post by replacing properties', async t => {
  const operation = {replace: {content: ['hello moon']}};
  const result = await postData.update(t.context.publication, t.context.url, operation);
  t.is(result.mf2.properties.content[0], 'hello moon');
});

test('Updates post by deleting entries', async t => {
  const operation = {delete: {category: ['foo']}};
  const result = await postData.update(t.context.publication, t.context.url, operation);
  t.is(result.mf2.properties.category[0], 'bar');
});

test('Updates post by deleting properties', async t => {
  const operation = {delete: ['category']};
  const result = await postData.update(t.context.publication, t.context.url, operation);
  t.falsy(result.mf2.properties.category);
});

test('Throws error updating post data', async t => {
  const operation = {delete: ['category']};
  const error = await t.throwsAsync(
    postData.update(false, t.context.url, operation)
  );
  t.is(error.message, 'Cannot read property \'get\' of undefined');
});