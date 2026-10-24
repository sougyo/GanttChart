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
vm.runInNewContext(extractFunction('handlesReferToSameFile'), context);
vm.runInNewContext(extractFunction('rememberAutoSaveTarget'), context);
vm.runInNewContext(extractFunction('isStoredTargetForAnotherDocument'), context);
vm.runInNewContext(extractFunction('createNewAutoSaveHandle'), context);

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

  const fileCEntry = {};
  const fileC = { isSameEntry: async other => other.entry === fileCEntry, entry: fileCEntry };
  const secondHandleForC = { isSameEntry: async other => other.entry === fileCEntry, entry: fileCEntry };
  context.knownAutoSaveTargets = [];
  context.loadAutoSaveHandleFromDB = async () => null;
  await context.rememberAutoSaveTarget(fileC, 'chart-a');
  assert.strictEqual(await context.isStoredTargetForAnotherDocument(secondHandleForC, 'chart-b'), true,
    'A -> C followed by B -> C must be rejected');
  assert.strictEqual(await context.isStoredTargetForAnotherDocument(secondHandleForC, 'chart-a'), false,
    'the original document may keep using its target');

  const createdFiles = [];
  const newHandle = { name: 'new-chart.json' };
  context.window = {
    showDirectoryPicker: async () => ({
      getFileHandle: async (name, options) => {
        if (!options || !options.create) {
          const error = new Error('not found');
          error.name = 'NotFoundError';
          throw error;
        }
        createdFiles.push(name);
        return newHandle;
      }
    })
  };
  assert.strictEqual(await context.createNewAutoSaveHandle(), newHandle,
    'new target creation must return the newly created file handle');
  assert.strictEqual(createdFiles.length, 1,
    'new target creation must create exactly one file');

  assert.match(source, /put\(\{ handle, documentId \}, 'autoSave'\)/,
    'the persisted handle must be associated with a document ID');
  assert.match(source, /let state = \{\s+id: generateDocumentId\(\)/,
    'new charts must receive a persistent ID');
  assert.match(source, /stored\.documentId !== state\.id/,
    'startup restore must reject a handle for another document');
  assert.match(source, /deactivateAutoSave\(false\)/,
    'switching documents must retain the previous file association');
  assert.match(source, /if \(perm !== 'granted'\) return;/,
    'startup restore must stay disabled without permission');
  assert.match(source, /createWritable\(\{ keepExistingData: true \}\)/,
    'auto-save must preserve existing data until a complete write succeeds');
  assert.match(source, /await writable\.truncate\(new Blob\(\[json\]\)\.size\)/,
    'auto-save must truncate the preserved copy to the new JSON byte length');
  assert.match(source, /if \(writable\) \{\s+try \{ await writable\.abort\(\)/,
    'failed writes must explicitly abort the temporary file');
  assert.doesNotMatch(source, /showSaveFilePicker/,
    'auto-save must not use a save picker that can truncate an existing file before validation');
  assert.match(source, /showOpenFilePicker/,
    'existing auto-save targets must be selected without opening them for replacement');
  assert.match(source, /getFileHandle\(name, \{ create: true \}\)/,
    'new auto-save targets must be created only after confirming the name is unused');
  assert.match(source, /const saved = await doAutoSave\(\);\s+if \(saved && handle === autoSaveHandle\) \{\s+try \{\s+await storeAutoSaveHandle/,
    'the initial file write must succeed before handle persistence is attempted');
  assert.match(source, /if \(mode === 'existing' && await isStoredTargetForAnotherDocument/,
    'new file creation must not depend on reading persisted handle metadata');

  console.log('Auto-save safety checks passed.');
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
