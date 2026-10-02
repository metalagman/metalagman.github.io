export function destination(location) {
  const aliases = {
    '/index': '/', '/index.html': '/',
    '/projects.html': '/projects', '/projects/': '/projects', '/projects/index.html': '/projects',
    '/cv.html': '/cv', '/cv/': '/cv', '/cv/index.html': '/cv',
  };
  const target = new URL('https://metalagman.dev/');
  target.pathname = aliases[location.pathname] ?? location.pathname;
  target.search = location.search;
  target.hash = location.hash;
  return target;
}
