module.exports = api => {
  const isTest = api.env('test');

  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
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
