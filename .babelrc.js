module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    [
      '@babel/preset-typescript',
      {
        // https://babeljs.io/docs/en/babel-plugin-transform-typescript#impartial-namespace-support
        allowNamespaces: true,
      },
    ],
  ],
};
