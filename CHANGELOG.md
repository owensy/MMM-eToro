# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-03-01
### Added
- **ROI Percentage Tracking:** Each asset now displays its percentage gain/loss (ROI) in addition to the cash value.
- **Dynamic P/L Coloring:** Percentage text now inherits the color-coded status (Green/Red) of the asset.
- **Enhanced CSS:** Added specific styling for sub-text to keep the layout clean on small screens.
- **Total Portfolio Summary:** Added a footer row that displays total equity, total cash profit/loss, and overall ROI percentage for the entire portfolio.
- **Configurable Summary:** Added `showTotal` configuration option to toggle the summary row on or off.

### Changed
- Refactored `node_helper.js` to use native `fetch` API instead of `axios` for better performance and zero-dependency install.
- Improved table spacing and added a visual divider for the total summary row.

## [1.0.0] - 2026-03-01
### Added
- Initial release of MMM-eToro.
- Automatic asset aggregation (grouping multiple trades of the same stock).
- Dynamic SVG logo and asset name fetching from eToro Market API.
- Support for Real and Virtual (Demo) portfolios via config.
- Project infrastructure: MIT License, Code of Conduct, and Dependabot.

---
*Note: Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).*
