module.exports = {
  plugins: [
    require('autoprefixer')(), // 给css自动添加前缀
    [
      'postcss-pxtorem',
      {
        rootValue: 100, // root element font size
        unitPrecision: 5, // （数字）允许REM单位增长的十进制数字
        replace: true, // （布尔值）替换包含rems的规则，而不添加后备
        mediaQuery: false, // （布尔值）允许在媒体查询中转换px
        minPixelValue: 0, // （数字）设置要替换的最小像素值
        selectorBlackList: [], // 忽略转换正则匹配项
        propList: ['*'], // 可以从px转换为rem的属性，匹配正则
        exclude: /node_modules/i, // （字符串，正则表达式，函数）要忽略并保留为px的文件路径
      },
    ],
  ],
};
