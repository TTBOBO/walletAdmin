// vue.config.js
const path = require("path");

module.exports = {
    chainWebpack: config => {
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        types.forEach(type => addStyleResource(config.module.rule("stylus").oneOf(type)));
        config.plugin("html").tap(args => {
            args[0].title = "财务钱包后台管理";
            return args;
        });
    }
};

function addStyleResource (rule) {
    rule.use("style-resource")
        .loader("style-resources-loader")
        .options({
            patterns: [
                path.resolve(__dirname, "./src/global/styl/var.styl"),
                path.resolve(__dirname, "./src/global/styl/reset.styl"),
                path.resolve(__dirname, "./src/global/styl/public.styl")
            ]
        });
}
