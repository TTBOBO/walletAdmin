<style lang="stylus">
body {
    background: #EBEEF2;
}

.content {
    f_content();
}
</style>

<template>
    <Header v-if="$route.path != '/login'"></Header>
    <div :class="$route.path != '/login' && 'content'">
        <router-view/>
    </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/views/Header.vue";

export default defineComponent({
    name: "App",
    components: {
        Header
    }

});
</script>
