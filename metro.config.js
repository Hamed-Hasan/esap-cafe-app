const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Configure resolver for better web compatibility
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'mjs', 'cjs'],
  assetExts: config.resolver?.assetExts?.filter((ext) => ext !== 'svg') || [],
};

// Configure transformer for web
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = withNativeWind(config, { input: './src/app/global.css' });

