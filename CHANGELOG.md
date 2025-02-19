# Changelog

All notable changes to this project will be documented in this file.

## [0.5.2] - 2025-02-19

# Changed implementation
- Finally its working! Instead of `this.constructor` or `this.prototype`, we re-extract the object constructor keys to make it work. So accessing static `this.css` for styling works now!

# Added implementation
- Added `eachAttrs` on `Elemxx` class