const test = require('node:test');
const assert = require('node:assert/strict');
const { csrfProtection } = require('../middleware/csrf');

function responseMock() {
  return {
    cookies: [],
    cookie(name, value) { this.cookies.push({ name, value }); },
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('CSRF middleware issues a token for a safe request', () => {
  const req = { method: 'GET', cookies: {}, get: () => undefined };
  const res = responseMock();
  let called = false;
  csrfProtection(req, res, () => { called = true; });
  assert.equal(called, true);
  assert.equal(res.cookies[0].name, 'csrfToken');
});

test('CSRF middleware rejects an unsafe request without a matching token', () => {
  const req = { method: 'POST', cookies: { csrfToken: 'expected' }, get: () => 'wrong' };
  const res = responseMock();
  let called = false;
  csrfProtection(req, res, () => { called = true; });
  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
});
