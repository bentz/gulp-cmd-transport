define("foo/a", [ "./b" ], function(require, exports, module) {
    exports.a = require("./b");
});