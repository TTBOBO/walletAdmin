import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

interface State {
    count: number;
}

export const key: InjectionKey<Store<State>> = Symbol("key");

export default createStore({
    state: {
        count: 0
    },
    mutations: {},
    actions: {},
    modules: {}
});

export function useStore () {
    return baseUseStore(key);
}

