// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserlist" field in package.json
    "autoprefixer": {},
    "postcss-write-svg": {
        utf8: false
    },
    "postcss-px-to-viewport": {
        unitToConvert: 'px',
        viewportWidth: 750,     // (Number) The width of the viewport.
        unitPrecision: 3,       // (Number) The decimal numbers to allow the REM units to grow to.
        viewportUnit: 'vw',     // (String) Expected units.
        selectorBlackList: ['.ignore', '.hairlines'],  // (Array) The selectors to ignore and leave as px.
        minPixelValue: 1,       // (Number) Set the minimum pixel value to replace.
        mediaQuery: false       // (Boolean) Allow px to be converted in media queries.
    },
    "postcss-viewport-units":{},
  }
}
