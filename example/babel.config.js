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
  ]
}
