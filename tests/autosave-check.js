#!/usr/bin/env node

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const target = path.resolve(__dirname, '..', 'index.html');
const source = fs.readFileSync(target, 'utf8');

function extractFunction(name) {
  const start = source.indexOf(`async function ${name}(`);
  assert.notStrictEqual(start, -1, `${name} must exist`);
  let depth = 0;
  let bodyStarted = false;
  for (let i = start; i < source.length; i++) {
    if (source[i] === '{') {
      depth++;
      bodyStarted = true;
    } else if (source[i] === '}') {
      depth--;
      if (bodyStarted && depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`Could not extract ${name}`);
}

const context = {};
vm.runInNewContext(extractFunction('inspectAutoSaveTarget'), context);

function handleFor(contents) {
  return {
    getFile: async () => ({
      size: Buffer.byteLength(contents),
      text: async () => contents
    })
  };
}

async function run() {
  const chart = id => JSON.stringify({ id, rows: [], startDate: '2026-01-01', endDate: '2026-01-31' });

  assert.strictEqual(await context.inspectAutoSaveTarget(handleFor(chart('chart-a')), 'chart-a'), 'match');
  assert.strictEqual(await context.inspectAutoSaveTarget(handleFor(chart('chart-b')), 'chart-a'), 'mismatch');
  assert.strictEqual(await context.inspectAutoSaveTarget(handleFor('{broken'), 'chart-a'), 'invalid');
  assert.strictEqual(await context.inspectAutoSaveTarget(handleFor(''), 'chart-a'), 'invalid');
  assert.strictEqual(await context.inspectAutoSaveTarget(handleFor(''), 'chart-a', true), 'empty');
  assert.strictEqual(await context.inspectAutoSaveTarget(handleFor(JSON.stringify({ rows: [] })), 'chart-a'), 'invalid');

  assert.match(source, /put\(\{ handle, documentId \}, 'autoSave'\)/,
    'the persisted handle must be associated with a document ID');
  assert.match(source, /let state = \{\s+id: generateDocumentId\(\)/,
    'new charts must receive a persistent ID');
  assert.match(source, /stored\.documentId !== state\.id/,
    'startup restore must reject a handle for another document');
  assert.match(source, /if \(perm !== 'granted'\) return;/,
    'startup restore must stay disabled without permission');

  console.log('Auto-save safety checks passed.');
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
