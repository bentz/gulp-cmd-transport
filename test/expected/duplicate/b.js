define("b", [ "./d" ], function(require, exports, module) {
    require("./d");
    module.exports = "baz";
});