
# Changelog

All notable changes to this project will be documented in this file.

## [0.6] - 2025-04-19
All `0.5.4>` are merged to this version

## [0.5.6] & [0.5.7] - 2025-04-19

### Fixed implementation
- Fix bug on styles, still catching it

## [0.5.5] - 2025-04-19

Please upgrade to `0.6` since theres a bug when checking the styles

### Added implementation
- Checks the styles if exist or not, if it dosent, add it to DOM and add to the list of added styles. This was a bug since its adding styles infinitely without checking

## [0.5.4] - 2025-04-18

Please upgrade to `0.6` since theres a bug when checking the styles

### Removed implementation
- `Elemxx.attrList` was removed, use `Elemxx.observedAttributes` instead

### Changed implementation
-  Instead adding on current Element, `Elemxx.css` will add the css to head

## [0.5.3] - 2025-02-19

### Changed internal implementation
- Fix typo when adding to `this.attrs`

## [0.5.2] - 2025-02-19

### Added implementation
- Added `eachAttrs` on `Elemxx` class

### Changed implementation
- Finally its working! Instead of `this.constructor` or `this.prototype`, we re-extract the object constructor to make it work. So accessing static `this.css` for styling works now!
