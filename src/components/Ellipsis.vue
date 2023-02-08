<style lang="stylus" scoped>
.ellipsis {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<template>
    <el-popover
        placement="top-end"
        trigger="hover"
        :open-delay="500"
        :close-delay="100"
        :content="con">
        <template #reference>
            <div class="ellipsis">{{ con }}</div>
        </template>
    </el-popover>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Ellipsis",
    props: ["con"]
});
</script>
