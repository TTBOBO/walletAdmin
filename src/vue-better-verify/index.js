/*
 created by czh
 created time 2020/9/10
 description: 全局自定义指令
 */

import { regExpConfig } from "./regExpConfig";
import mergeOptions from "./util/mergeOptions";
import installDirective from "./installDirective";

export default {
    install (app, options = {}) {
        // 查看是否有传入配置参数
        let defaultOptions = {
            regExp: regExpConfig,
            defaultStyle: true
        };
        options = mergeOptions(defaultOptions, options);

        app.directive("verify", {
            mounted (el, binding) {
                installDirective(el, binding, app, options);
            }
        });

    }
};
