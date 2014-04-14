define("bar/b", [ "./c" ], function(require, exports, module) {
    exports.b = require("./c");
});