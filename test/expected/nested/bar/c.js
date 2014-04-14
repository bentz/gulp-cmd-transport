define("bar/c", [ "../foo/a" ], function(require, exports, module) {
    exports.c = require("../foo/a");
});