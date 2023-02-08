declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// declare module "@vue/runtime-core" {
//     import type { ApiConfig } from "@/api";
//
//     export interface ComponentCustomProperties {
//         api: ApiConfig;
//     }
// }
