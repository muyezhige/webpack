// 首页
require("./js/a.js");
require("./js/b.js");
/*使用别名*/

// require('newPath/lib.js'); 路径别名。
require('lib'); // 直接使用别名

// require('bootstrap');
document.write(require("./js/index.js"));
require("./css/index.scss");
console.log(require('./images/a.png'));