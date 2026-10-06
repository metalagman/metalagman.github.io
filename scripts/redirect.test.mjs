import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('legacy destinations normalize bookmarks and preserve search and fragment', async () => {
  const { destination } = await import('./redirect.mjs');
  for (const [path, expected] of [
    ['/', '/'], ['/index.html', '/'], ['/index', '/'],
    ['/projects', '/projects'], ['/projects.html', '/projects'],
    ['/projects/', '/projects'], ['/projects/index.html', '/projects'],
    ['/cv.html', '/cv'], ['/cv/', '/cv'], ['/unknown/nested', '/unknown/nested'],
  ]) {
    const url = destination({ pathname: path, search: '?source=legacy', hash: '#section' });
    assert.equal(url.href, `https://metalagman.dev${expected}?source=legacy#section`);
  }
});

test('publication contains only redirect pages, including usable fallback links', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'legacy-redirect-test-'));
  try {
    await mkdir(join(directory, 'redirects'));
    await writeFile(join(directory, 'redirects', 'old-site.js'), 'stale');
    execFileSync(process.execPath, [fileURLToPath(new URL('./build-redirects.mjs', import.meta.url))], { cwd: directory });
    assert.deepEqual((await readdir(join(directory, 'redirects'))).sort(), ['404.html', 'cv.html', 'index.html', 'projects.html']);
    const { destination } = await import('./redirect.mjs');
    for (const filename of ['404.html', 'cv.html', 'index.html', 'projects.html']) {
      const html = await readFile(join(directory, 'redirects', filename), 'utf8');
      assert(html.includes(destination.toString()));
      assert(html.includes('window.location.replace(target.href)'));
      assert.match(html, /<a id="destination" href="https:\/\/metalagman\.dev\//);
      assert(html.includes('<noscript>'));
      if (filename !== '404.html') {
        const route = filename === 'index.html' ? '/' : `/${filename.replace(/\.html$/, '')}`;
        const target = `https://metalagman.dev${route}`;
        assert(html.includes(`<link rel="canonical" href="${target}">`));
        assert(html.includes(`<meta http-equiv="refresh" content="0; url=${target}">`));
        assert(html.includes(`<a id="destination" href="${target}">`));
      } else {
        assert(!html.includes('http-equiv="refresh"'));
      }
      assert(!html.includes('<script src='));
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('paths and query values cannot choose another redirect origin', async () => {
  const { destination } = await import('./redirect.mjs');
  for (const pathname of ['//evil.example/path', '/\\evil.example/path', '/%2f%2fevil.example', '/https://evil.example']) {
    const url = destination({ pathname, search: '?next=https://evil.example', hash: '#https://evil.example' });
    assert.equal(url.origin, 'https://metalagman.dev');
    assert.equal(url.search, '?next=https://evil.example');
  }
});
