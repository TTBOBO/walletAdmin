<template>
    <h1>一个普通标题</h1>
    <h2>标题二{{ counter }}</h2>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";
import { AxiosInstance } from "axios";
import api from "@/api";

export default defineComponent({
    name: "Home",
    setup () {
        const counter = ref<number>(0);
        const axios = inject("axios") as AxiosInstance;
        axios({
            ...api.queryWithdrawalAddress
        }).then(res => {
            console.log("结果");
            console.log(res);
        });

        return {
            counter
        };
    }
});
</script>
