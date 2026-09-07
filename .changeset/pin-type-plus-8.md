---
"satisfier": patch
---

Pin the `type-plus` dev dependency to the exact `8.0.0-beta.10` prerelease.

`type-plus` is a development-only dependency here (used for type-level tests) and none of its types leak into the published `.d.ts` files, so this has no effect on consumers. The exact pin, rather than a caret range, is deliberate: `8.0.0-beta.10` is on a prerelease line where breaking changes have landed between betas, so each future bump goes through its own reviewed PR instead of being resolved silently by a lockfile refresh.
