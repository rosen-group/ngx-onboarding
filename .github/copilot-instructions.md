# Copilot Instructions for ngx-onboarding

## Repository Overview

This is an **Angular workspace** containing two projects:
- **`projects/ngx-onboarding`** — the publishable library (`@rosen-group/ngx-onboarding`)
- **`src/`** — a demo application (`ngx-onboarding-app`) used for development and showcasing the library

## Build, Test & Run Commands

```bash
# Start the demo app (http://localhost:4200)
ng serve

# Test the library only (headless, with coverage)
npm test

# Test the demo app
npm run test-app

# Build the library into dist/ngx-onboarding
npm run build-lib

# Clean, build library, and pack into a .tgz
npm run package
```

**To run/focus a single test**, use Jasmine's `fdescribe` / `fit` in the spec file — there is no CLI flag for it.

## Architecture

### Library structure (`projects/ngx-onboarding/src/lib/`)

The public API surface is defined in `src/public_api.ts`. Key exports:

| Export | Purpose |
|---|---|
| `OnboardingModule` | Import into the host app's root module |
| `OnboardingService` | Main orchestrator — registers items, tracks state |
| `OnboardingComponent` (`rosen-onboarding`) | Main UI component, place in app shell |
| `OnboardingButtonComponent` (`rosen-onboarding-button`) | Context menu button (reset/enable/disable) |
| `SeenSelectorsBaseService` | Abstract — override to change persistence of seen items |
| `EnabledStatusBaseService` | Abstract — override to change persistence of enabled state |
| `TranslatorBaseService` | Abstract — override to plug in ngx-translate or custom i18n |

### Extensibility via DI

The library ships with `LocalStorage*` and `BuildInTranslator` defaults. Consumers override them with:
```typescript
{ provide: SeenSelectorsBaseService, useClass: MyCustomSeenService }
```

### OnboardingService flow

1. Consumer calls `onboardingService.register(items)` — returns an **unregister function** that must be called in `ngOnDestroy`.
2. Service polls the DOM on a 2-second interval (`refreshTime`) to find visible registered elements.
3. Items sharing the same `group` string are displayed together and navigated as a set.
4. `OnboardingItemContainer` manages the current/next group traversal.
5. Seen selectors and enabled status are persisted asynchronously via the base service abstractions.

## Key Conventions

- **Component selector prefix**: `rosen-` for all library components.
- **Stylesheets**: LESS (not SCSS). Shared variables are in `variables.less`. Library components use `ViewEncapsulation.None` intentionally so the `onboarding-highlighted` / `onboarding-highlighted-on-static` CSS classes apply to host-app elements.
- **Standalone components**: Library components use Angular standalone (`imports: [...]` in `@Component`) — there are no `declarations` arrays.
- **Mock files**: Test doubles follow the `*.service.mock.ts` naming convention (e.g., `onboarding.service.mock.ts`).
- **Onboarding JSON config**: Items are loaded at runtime via `HttpClient` and passed to `onboardingService.register()`. The `group` field controls which items are shown together. Translations per item go in the `descriptions` array.
- **Library version** is in `projects/ngx-onboarding/package.json`; the workspace version is in the root `package.json`.

## i18n

UI labels (buttons, error messages) are translated via `TranslatorBaseService`. The built-in implementation has no translations — for i18n, provide `TranslateService` from `ngx-translate` or a custom service. See `I18N.md` for the full list of translation keys (`ONBOARDING`, `ONBOARDING_GOT_IT_MSG`, etc.).
