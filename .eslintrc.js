module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module'
    },
    env: {
      es6: true,
      browser: true,
      node: true
    },
    extends: 'eslint:recommended',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // check if imports actually resolve
    'settings': {
        'import/resolver': {
            'webpack': {
                'config': 'build/webpack.base.conf.js'
            }
        }
    },
    // lufylegend 执行代码时脚步需要访问的额外全局变量。
    "globals": {
        "BlobBuilder":true,
        "console":true,
        "Box2D":true,
        "webkitAudioContext":true,
        "ActiveXObject":true,
        "enableWebGLCanvas":true
    },
    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        //'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-debugger': 0,
        "no-console": 0,
        'no-unused-vars': ["error", {"vars": "all", "args": "none", "ignoreRestSiblings": true }],

        //"indent": ["error", "tab"]
    }
}
