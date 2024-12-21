const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const glob = require("glob");
const mode = process.env.NODE_ENV || "development";
const devMode = mode === "development";
const target = devMode ? "web" : "browserslist";

const HTML_FILES = glob.sync("./src/*.html");
const pages = HTML_FILES.map((page) => {
  return new HtmlWebpackPlugin({
    template: path.resolve(__dirname, page),
    filename: path.basename(page),
    chunks: [path.basename(page, ".html"), "main"],
    minify: false,

  });
});

const sourcePath = path.resolve(__dirname, "./", "src/assets/");
const destPath = path.resolve(__dirname, "./", "dist/assets/");


//рабочий
// const INCLUDE_PATTERN =
//   /<include\s+src=["'](\.\/)?([^"']+)["']\s+data-props='([^']+)'\s*><\/include>/g;

const INCLUDE_PATTERN =
  /<include\s+src=["'](\.\/)?([^"']+)["'](?:\s+data-props='([^']+)')?\s*><\/include>/g;

const { JSDOM } = require("jsdom");

function processNestedHtml(content, loaderContext, resourcePath = "") {
  let fileDir =
    resourcePath === ""
      ? path.dirname(loaderContext.resourcePath)
      : path.dirname(resourcePath);

  function replaceHtml(match, pathRule, src, dataProps) {

    if (pathRule === "./") {
      fileDir = loaderContext.context;
    }
    const filePath = path.resolve(fileDir, src);
    loaderContext.dependency(filePath);
    let html = fs.readFileSync(filePath, "utf8");
    try {

      const data = dataProps && JSON.parse(dataProps);
      const dom = new JSDOM(html);
      const document = dom.window.document;


      if (data) {
        Object.keys(data).forEach((selector) => {
          const elementData = data[selector];
          const elements = document.querySelectorAll(selector);

          if (elements.length > 0) {
            elements.forEach((element) => {
              if (elementData.text) {
                element.textContent = elementData.text;
              }
              if (elementData.html) {
                element.innerHTML = elementData.html;
              }
              if (elementData.class) {
                element.classList.add(elementData.class);
              }
            });
          } else {
            console.error(
              `Elements with selector "${selector}" not found in ${src}`
            );
          }
        });
      }

      html = document.body.innerHTML;
      // Рекурсивно обрабатываем вложенные компоненты

      html = processNestedHtml(html, loaderContext, filePath);
    } catch (error) {
      console.error(`Error parsing data-text attribute: ${error.message}`);
    }

    return html;
  }

  content = content.replace(
    INCLUDE_PATTERN,
    (match, pathRule, src, dataProps) => {
      return replaceHtml(match, pathRule, src, dataProps);
    }
  );

  return content;
}

function processHtmlLoader(content, loaderContext) {
  let newContent = processNestedHtml(content, loaderContext);
  newContent = newContent.replace(
    /<title>.*?<\/title>/i, `<title>${loaderContext.resourcePath.split('\\').at(-1)}</title>`
  );
  newContent = newContent.replace(
    /(src|data-src)="(.*?)\.(jpg|png)"/gi,
    (match, p1, p2) => {
      return `${p1}="${p2}.webp"`;
    }
  );
  return newContent;
}

module.exports = {
  mode,
  target,
  devtool: devMode ? "inline-source-map" : false, //сорс мапа
  devServer: {
    historyApiFallback: true,
    open: true,
    hot: true,
    port: "8080",
    host: "local-ip",
    static: path.resolve(__dirname, "dist"),
    watchFiles: path.join(__dirname, "src"),
  },


  entry: {
    main: path.resolve(__dirname, "src", "index.js"),
  },
  // entry: getEntries(),
  output: {
    //куда выводит билд
    path: path.resolve(__dirname, "dist"),
    //очистка билда перед сборкой нового
    clean: true,
    //название js файла в билде
    // [name] - стандартный по вебпаку (main), [contenthash] - добавляептся хэш к названию
    filename: "js/[name].js",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({

        terserOptions: {
          compress: true,
        },
        extractComments: false, // Убираем комментарии из минифицированного бандла
        exclude: /main\.js$/, // Минимизируем все кроме мэйна, только либы
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // получает имя, то есть node_modules/packageName/not/this/part.js
            // или node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            if (packageName.length){
              return `${packageName[1].replace('@', '')}`;
            }
              // имена npm-пакетов можно, не опасаясь проблем, использовать
              // в URL, но некоторые серверы не любят символы наподобие @
           
          },
        },
      },
    },

  },

  plugins: [

    new CleanWebpackPlugin(),
    ...pages,
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "[name].[contenthash:8].css",
    }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify, // Выбор реализации минимизации изображений
        options: {
          plugins: [
            "imagemin-gifsicle", // Плагин для оптимизации GIF изображений
            "imagemin-mozjpeg", // Плагин для оптимизации JPEG изображений
            "imagemin-pngquant", // Плагин для оптимизации PNG изображений
            "imagemin-svgo", // Плагин для оптимизации SVG изображений
          ],
        },
      },
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png)/,
          options: {
            quality: 90,
            overrideExtension: true,
          },
        },
      ],
      detailedLogs: false,
      silent: false,
      strict: true,
    }),
    fs.existsSync(sourcePath)
      ? new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "./", "src/assets/", "images"),
            to: path.resolve(__dirname, "./", "dist/assets/", "images"),
            noErrorOnMissing: true,
          },
          {
            from: path.resolve(__dirname, "./", "src/assets/", "fonts"),
            to: path.resolve(__dirname, "./", "dist/assets/", "fonts"),
            noErrorOnMissing: true,
          },
          {
            from: sourcePath,
            to: destPath,
            noErrorOnMissing: true,
          },
        ],
      })
      : new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "./", "src/assets/", "images"),
            to: path.resolve(__dirname, "./", "dist/assets/", "images"),
            noErrorOnMissing: true,
          },
          {
            from: path.resolve(__dirname, "./", "src/assets/", "fonts"),
            to: path.resolve(__dirname, "./", "dist/assets/", "fonts"),
            noErrorOnMissing: true,
          },
        ],
      }),
   
  ],



  module: {
    rules: [
      {
        test: /\.html$/i,
        use: [
          {
            loader: "html-loader",
            options: {
              sources: false,
              minimize: false,
              esModule: false,
              preprocessor: processHtmlLoader,
            },
          },
        ],
      },
      // изображения
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              esModule: false,
              modules: {
                auto: true,
                namedExport: true,
                localIdentName: "foo__[name]__[local]",
              },
              url: false,
            },
          },
          "group-css-media-queries-loader",
          "sass-loader",
        ]
      },
      // шрифты
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext]",
        },
      },
      //js
      {
        test: /\.(?:js|mjs|cjs)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      }
    ],
  },
  /*  externals: {
     swiper: "Swiper", // Исключаем Swiper из обработки
   }, */
};
