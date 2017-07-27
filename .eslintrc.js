'use strict';

const path = require('path');

function withProjectRootPath(relativePath) {
  return path.join(__dirname, relativePath);
}

module.exports = {
  "extends": "eslint-config-airbnb",
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "parser": "babel-eslint",
  "rules": {
    //
    // Safety
    //
    // Warn about unused variables. An unused variable is generally a sign of an error.
    "no-unused-vars": "warn",
    // Warn about `alert` calls, we don't want them in production code. Use `eslint-disable-line no-alert` in development-only code.
    "no-alert": "warn",
    // Use the `eslint-disable-line no-console` comment for intentional console statements.
    "no-console": "warn",
    // The `no-use-before-define` prevents variable and function use before definition.
    "no-use-before-define": "warn",
    // The `no-var` enforces `const` and `let`. Use `eslint-disable-line no-var` if required in untranspiled Node.js scripts only.
    "no-var": "warn",
    // The `block-scoped-var` warns about possibly invalid logic when `var` is declared in a block scope and used outside. We prefer `const` and `let` over `var` but keep this for now.
    "block-scoped-var": "warn",
    // Disable `guard-for-in` because we use `Object.keys().forEach` and do not have to extend `Object.prototype` for older browsers.
    "guard-for-in": "off",
    // Warn about using the outer scope variable name for an inner scope variable.
    "no-shadow": "warn",
    // Disable `no-param-reassign` to avoid useless renaming. Be careful.
    "no-param-reassign": "off",

    //
    // Coding style
    //
    "indent": [ "warn", 2, { "SwitchCase": 1 } ],
    "padded-blocks": "off",
    // The `spaced-comment` warns about the commented-out source code and dirty comments.
    "spaced-comment": "warn",
    // The `comma-dangle` helps to keep version control clean if array or object items are added or removed - only the lines that are actually changed will be highlighted.
    "comma-dangle": [ "warn", "always-multiline" ],
    "space-in-parens": "off",
    // TODO: Re-enable `curly` and fix.
    "curly": [ "off", "all" ],
    "array-bracket-spacing": [ "warn", "always" ],
    "object-curly-spacing": [ "warn", "always" ],
    "computed-property-spacing": "off",
    "brace-style": [ "warn", "stroustrup", { "allowSingleLine": true } ],
    "no-trailing-spaces": [ "warn", { "skipBlankLines": true } ],
    "linebreak-style": [ "warn", "unix" ],
    "no-multiple-empty-lines": [ "warn", { "max": 2, "maxEOF": 1 } ],
    "eol-last": [ "error", "unix" ],
    "id-length": [ "warn", { "min": 2, "exceptions": [ "_", "$", "i", "j", "k", "x", "y", "e" ] } ],
    "camelcase": "warn",
    "func-names": "warn",
    "keyword-spacing": "warn",
    "space-before-blocks": "warn",
    "space-before-function-paren": [ "warn", { "anonymous": "always", "named": "never" } ],
    "quotes": [ "warn", "single", "avoid-escape" ],
    "no-multi-spaces": [ "warn", { "exceptions": { "VariableDeclarator": true, "ImportDeclaration": true } } ],
    "dot-notation": "off",
    "prefer-template": "off",
    "prefer-arrow-callback": "warn",
    "max-len": [ "warn", 250, 4, { "ignoreComments": true } ],
    "arrow-parens": [ "warn", "always" ],
    "arrow-body-style": "off",
    "object-shorthand": "off",
    "no-case-declarations": "warn",
    "no-nested-ternary": "off",
    "global-require": "off",
    "no-underscore-dangle": "off",
    "no-useless-concat": "off",
    "no-mixed-operators": "off",
    // NOTE: Keep bitwise, can use unary negation `~` for `indexOf`.
    "no-bitwise": "off",
    "no-plusplus": "off",
    "no-continue": "off",
    "newline-per-chained-call": "off",
    // WORKAROUND: airbnb disallows `for..of` https://github.com/airbnb/javascript/issues/1122#issuecomment-266219071 https://github.com/flying-sheep/eslint-config/blob/v2.0.1/defaults.js#L22
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
      "LabeledStatement",
      "WithStatement",
    ],
    "lines-around-directive": "off",
    "class-methods-use-this": "off",

    //
    // React:
    //
    "react/prop-types": "warn",
    "react/require-default-props": "off",
    // TODO: Re-enable `react/forbid-prop-types` and fix vague proptypes such as `PropTypes.object` and `PropTypes.array`.
    "react/forbid-prop-types": "off",
    // TODO: Re-enable `react/forbid-foreign-prop-types` and properly import proptypes from components.
    "react/forbid-foreign-prop-types": "off",
    // TODO: Re-enable `react/forbid-component-props` and remove `className` and `style` from components.
    "react/forbid-component-props": [ "off", { "forbid": [ "className", "style" ] } ],
    // NOTE: The `react/no-unused-prop-types` rule does not work properly. @see https://github.com/yannickcr/eslint-plugin-react/issues/816
    "react/no-unused-prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [ "warn", { "extensions": [ ".js", ".jsx" ] } ],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-quotes": "off",
    "react/jsx-first-prop-new-line": "off",
    // NOTE: The `react/jsx-closing-bracket-location` rule does not work properly; should use `line-aligned` when it gets fixed; no GitHub issue yet.
    // TODO: Make a GitHub issue for the `react/jsx-closing-bracket-location` rule's `line-aligned` malfunction.
    "react/jsx-closing-bracket-location": "off",
    "react/jsx-tag-spacing": "warn",
    "react/jsx-curly-spacing": "off",
    // NOTE: Unfortunately, `react/jsx-indent` does not understand indent in parens in ternary. @see https://github.com/yannickcr/eslint-plugin-react/issues/454
    "react/jsx-indent": "off",
    "react/self-closing-comp": [ "warn", { "component": true, "html": false } ],
    "react/no-multi-comp": "off",
    "react/sort-comp": "off",
    "react/prefer-stateless-function": "warn",
    // NOTE: The `react/no-children-prop` crashes. The fix hasn't been released as of now. @see https://github.com/yannickcr/eslint-plugin-react/commit/f227eb4e536426773c71674502958f0f96b75040
    "react/no-children-prop": "off",
    "react/no-danger-with-children": "error",

    "jsx-a11y/href-no-hash": "off",
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/anchor-is-valid": ["warn", { "aspects": ["invalidHref"] }],
    "jsx-a11y/no-static-element-interactions": "off",

    "jsx-quotes": "error",

    //
    // ES6:
    //
    "import/first": "off",
    "import/default": "off",
    "import/no-duplicates": "error",
    "import/named": "error",
    "import/namespace": [ "error", { "allowComputed": false } ],
    "import/no-extraneous-dependencies": [ "error", {
      "devDependencies": true
    } ],
    "import/newline-after-import": "off",
    "import/imports-first": "off",
    "import/no-unresolved": [ "error", {} ],
    "import/no-named-as-default": "error",
    "import/extensions": [ "warn", "always", { "": "never", "js": "never" } ],
    "import/no-deprecated": "warn",
  },
  "plugins": [
    "react",
    "import",
  ],
  "settings": {
    "import/ignore": [
      "node_modules",
      "\\.(scss|less|css)$",
    ],
    "import/resolver": {
      "node": {
        "moduleDirectory": [
          "node_modules",
          "./src/client",
          "./src/server",
          "./src/common",
        ],
      },
    },
  },
  "globals": {
    "GOOGLE_MAPS_API_KEY": true,
    "__CLIENT__": true,
    "__SERVER__": true,
    "__DEVELOPMENT__": true,
    "google": true,
  },
};
