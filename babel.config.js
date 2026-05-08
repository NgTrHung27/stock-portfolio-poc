module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Support for path aliases configured in tsconfig.json
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@views': './src/views',
            '@models': './src/models',
            '@stores': './src/stores',
            '@ui-kit': './src/ui-kit',
          },
        },
      ],
      // react-native-reanimated/plugin MUST be the last plugin
      'react-native-reanimated/plugin',
    ],
  };
};
