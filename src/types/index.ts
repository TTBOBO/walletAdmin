import { ComponentInternalInstance, ComponentCustomProperties } from "vue";

export declare type CtxType = ComponentCustomProperties;

export declare interface CustomVueInstance extends ComponentInternalInstance {
    ctx: CtxType;
}
