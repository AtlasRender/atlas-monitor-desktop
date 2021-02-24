module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "erb",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/ban-types": "off",
    "only-arrow-functions": ["off"],
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    // "forin": false,  // TODO: check if there is a way to change this
    "object-shorthand": "warn",
    "no-console": "warn",
    "no-shadow": ["error", {builtinGlobals: true}]
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    "import/resolver": {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve("./.erb/configs/webpack.config.eslint.js"),
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
};
