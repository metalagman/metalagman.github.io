import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { destination } from './redirect.mjs';

await rm('redirects', { recursive: true, force: true });
await mkdir('redirects');
for (const [filename, path] of [
  ['index.html', '/'],
  ['projects.html', '/projects'], ['projects/index.html', '/projects'],
  ['cv.html', '/cv'], ['cv/index.html', '/cv'],
  ['404.html', null],
]) {
  const fallback = `https://metalagman.dev${path ?? '/'}`;
  await mkdir(dirname(`redirects/${filename}`), { recursive: true });
  await writeFile(`redirects/${filename}`, `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Site moved to metalagman.dev</title>
  ${path === null ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${fallback}">\n  <meta http-equiv="refresh" content="0; url=${fallback}">`}
</head>
<body>
  <p>This site has moved. <a id="destination" href="${fallback}">Continue to metalagman.dev</a>.</p>
  <noscript><p>Follow the link above to visit the new site.</p></noscript>
  <script>
    const target = (${destination.toString()})(window.location);
    document.getElementById('destination').href = target.href;
    window.location.replace(target.href);
  </script>
</body>
</html>
`);
}
