module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((loader) => {
            if (loader.test && loader.test.toString().includes('css')) {
              if (loader.use) {
                loader.use.forEach((useItem) => {
                  if (useItem.loader && useItem.loader.includes('postcss-loader')) {
                    useItem.options = {
                      ...useItem.options,
                      postcssOptions: {
                        plugins: [require('tailwindcss'), require('autoprefixer')],
                      },
                    };
                  }
                });
              }
            }
          });
        }
      });
      return webpackConfig;
    },
  },
};