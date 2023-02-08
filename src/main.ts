import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
// import "@/mock/mock";
import VueAxios from "vue-axios";
import axiosInstance from "@/plugin/axiosInstance";
import { AxiosInstance } from "axios";
import "dayjs/locale/zh-cn";
import locale from "element-plus/lib/locale/lang/zh-cn";
import api, { ApiConfig } from "@/api";
import VueVerify from "@/vue-better-verify";
import "animate.css";
import "@/global/iconfont.css";
import Ellipsis from "@/components/Ellipsis.vue";

const app = createApp(App); // 创建 vue 实例

app.provide<AxiosInstance>("axios", axiosInstance); //  提供axios供组件 setup 使用

// 注册全局组件
app.component("Ellipsis", Ellipsis);

// 绑定全局 api
app.config.globalProperties.api = api; // 向所有组件注入 api 对象

declare module "@vue/runtime-core" {
    export interface ComponentCustomProperties {
        api: ApiConfig;
        $verify: any;
        $message: any;
        $confirm: any;
    }
}

app.use(ElementPlus, { locale })
    .use(VueAxios, axiosInstance)
    .use(VueVerify)
    .use(store)
    .use(router)
    .mount("#app");
