import test from 'ava';
import {testServer} from '@indiekit-test/server';

test('Returns categories', async t => {
  const request = await testServer();

  const response = await request.get('/micropub')
    .set('Accept', 'application/json')
    .query('q=config');

  t.truthy(response.body['media-endpoint']);
  t.truthy(response.body['post-types']);
  t.truthy(response.body['syndicate-to']);
  t.truthy(response.body.q);
});
