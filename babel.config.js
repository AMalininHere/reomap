module.exports = api => {
  const isTest = api.env('test');

  return {
    presets: [
      '@babel/preset-typescript',
      '@babel/preset-react',
      [
        '@babel/preset-env',
        isTest ? ({
          targets: {
            node: 'current'
          }
        }) : ({
          bugfixes: true,
          modules: false
        })
      ],
    ],
    plugins: [
    ]
  };
};
