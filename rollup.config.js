import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js',
  output: {
    file: './dist/vue.js',
    sourcemap: true,
    name: 'Vue',
    format: 'umd', // umd模块打包，打包后可以在window上挂一个Vue对象
  },
  plugin: [
    babel({
      exclude: 'node_modules/**' // babel插件，将ES6+的代码转ES5
    }),
    serve({
      port: 3000,
      contentBase: '', // 表示以当前目录为基准
      openPage: '/index.html'
    })
  ]
}