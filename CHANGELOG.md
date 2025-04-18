
# Changelog

All notable changes to this project will be documented in this file.

## [0.5.4] - 2025-05-18

### Changed implementation
- `Elemxx.attrList` was removed, use `Elemxx.observedAttributes` instead
-  Instead adding on current Element, `Elemxx.css` will add the css to head

## [0.5.3] - 2025-02-19

### Changed internal implementation
- Fix typo when adding to `this.attrs`

## [0.5.2] - 2025-02-19

### Added implementation
- Added `eachAttrs` on `Elemxx` class

### Changed implementation
- Finally its working! Instead of `this.constructor` or `this.prototype`, we re-extract the object constructor to make it work. So accessing static `this.css` for styling works now!
