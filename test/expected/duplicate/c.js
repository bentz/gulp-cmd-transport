define("c", [ "./d" ], function(require, exports, module) {
    require("./d");
    module.exports = "baz";
});