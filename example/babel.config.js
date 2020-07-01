module.exports = {
  presets: [
    "@babel/preset-typescript",
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": [
            "last 1 chrome version"
          ]
        }
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-class-properties"
  ]
}
