# satisfier

## 5.4.5

### Patch Changes

- 32614df: Pin the `type-plus` dev dependency to the exact `8.0.0-beta.10` prerelease.
  
  `type-plus` is a development-only dependency here (used for type-level tests) and none of its types leak into the published `.d.ts` files, so this has no effect on consumers. The exact pin, rather than a caret range, is deliberate: `8.0.0-beta.10` is on a prerelease line where breaking changes have landed between betas, so each future bump goes through its own reviewed PR instead of being resolved silently by a lockfile refresh.

## 5.4.4

### Patch Changes

- de40417: Update `tersify` to `^4.0.6`.
  
  The build also moves from three `tsc` passes to `tsdown`. The published paths are
  unchanged (`esm/index.js`, `cjs/index.js`, and the `.d.ts` beside each), but the emitted
  JavaScript differs: the CJS output is now `es2015` rather than `es5`, and the unused
  `tslib/` output is no longer built. Two `isNaN` calls became `Number.isNaN`; both are
  already guarded by a `typeof x === 'number'` check, so behaviour is identical.

## 5.4.3

### Patch Changes

- 0e514b6: Publish through npm trusted publishing (OIDC) with provenance, and correct the package
  `version` back to the last real release. The previous `0.0.0-development` placeholder was
  taken literally by changesets and published as `latest` on 2026-08-09; this release moves
  the `latest` dist-tag back onto a real version.

## [5.4.2](https://github.com/unional/satisfier/compare/v5.4.1...v5.4.2) (2022-10-08)


### Bug Fixes

* function-object implementation ([1750ab3](https://github.com/unional/satisfier/commit/1750ab3d7953b0c54453c859203084a94f8bb6e6))

## [5.4.1](https://github.com/unional/satisfier/compare/v5.4.0...v5.4.1) (2022-10-08)


### Bug Fixes

* handles function-object ([6abc8c3](https://github.com/unional/satisfier/commit/6abc8c3497c440dfac66336a50fd6f56efc38bac)), closes [#228](https://github.com/unional/satisfier/issues/228)

# [5.4.0](https://github.com/unional/satisfier/compare/v5.3.0...v5.4.0) (2022-10-05)


### Features

* support date ([8f92d34](https://github.com/unional/satisfier/commit/8f92d3426456233f3207947789f08e6546205156))

# [5.3.0](https://github.com/unional/satisfier/compare/v5.2.2...v5.3.0) (2022-10-03)


### Features

* add `hasAll()` ([c330a0a](https://github.com/unional/satisfier/commit/c330a0aeb856a02f9446f1386cb1b441e1eda6d7))

## [5.2.2](https://github.com/unional/satisfier/compare/v5.2.1...v5.2.2) (2022-06-12)


### Bug Fixes

* add cjs/package.json ([e152c94](https://github.com/unional/satisfier/commit/e152c948700f323c1212ffcf90be94a9d5d5a322))

## [5.2.1](https://github.com/unional/satisfier/compare/v5.2.0...v5.2.1) (2022-06-10)


### Bug Fixes

* downgrade to ES2019 ([83d6317](https://github.com/unional/satisfier/commit/83d631789e5f065021b8eb871964fcb53f2695f4))

# [5.2.0](https://github.com/unional/satisfier/compare/v5.1.4...v5.2.0) (2022-06-04)


### Bug Fixes

* set sideEfffect to false ([0c10e21](https://github.com/unional/satisfier/commit/0c10e217ad70b1e7cf92f1acc06ca9d7cc94182d))


### Features

* add esm support ([bff529f](https://github.com/unional/satisfier/commit/bff529f5a0c416543615feb094be5d958bf9e29b))
