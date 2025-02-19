# Changelog

All notable changes to this project will be documented in this file.

## [0.5.2] - 2025-02-19

# Changed implementation
- Finally its working! Instead of `this.constructor` or `this.prototype`, but `Object.getOwnPropertyDescriptor(this)` works. So styling and attributes list works also!

# Added implementation
- Added `eachAttrs` on `Elemxx` class