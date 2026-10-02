# Legacy site redirects

The personal site now lives at https://metalagman.dev. Its source is maintained
in the private `metalagman/metalagman.dev` repository; Cloudflare Workers
deployment belongs to the home-lab Terragrunt `cloudflare/sites/metalagman` root.

This repository publishes only four small redirect pages through GitHub Pages.
Run `npm test` and `npm run build` to generate `redirects/`. JavaScript forwards
the existing path, query, and fragment to the fixed new origin, normalizing old
`.html` links for the home, projects, and CV pages. The 404 page forwards unknown
paths. A visible destination link works when JavaScript is disabled.

For emergency recovery, the complete former VitePress source and Pages workflow
remain in revision `316520a40c742bce822d767a5c528be9727338da`.
Restore `docs/`, `package.json`, `package-lock.json`, and
`.github/workflows/deploy.yml` from that revision on a recovery branch, build
and review them, then commit and push to `master` to redeploy. Preserve repository
instructions and Beads data. Restore the new origin first whenever possible;
reverting this publication does not change the Cloudflare Worker or DNS.
