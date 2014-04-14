define("a", [ "./b", "./c" ], function(require, exports, module) {
    require("./b");
    require("./c");
});