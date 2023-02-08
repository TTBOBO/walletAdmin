<style lang="stylus" scoped>
.search-wrap {
    margin-bottom: 20px;

    label {
        font-size: 16px;
        color: #333;
    }

    /deep/.el-input {
        width: 160px;
        margin-right: 20px;
    }
}
</style>

<template>
    <div class="search-wrap">
        <label>查询方式：</label>
        <el-select size="small" v-model="dateType" @change="changeDateType">
          <el-option v-for="item of dateOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <label>日期：</label>
        <el-date-picker v-model="searchKey.calculateTime" :type="pickerType" placeholder="选择日期" size="small" :format="dateFormat" :clearable="false" :editable="false" @change="changeDateValue"></el-date-picker>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-search"
                   :loading="searchBtnLoading"
                   @click="f_searchTable">查 询
        </el-button>
    </div>

    <el-table
        :data="tableData"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column prop="calculateTime" label="日期"></el-table-column>

        <el-table-column prop="chainName" label="链名称"></el-table-column>

        <el-table-column prop="coinName" label="币名称"></el-table-column>

        <el-table-column prop="amount" label="金额"></el-table-column>

        <el-table-column prop="fee" label="手续费"></el-table-column>
    </el-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useTable from "@/publicUse/useTable";
import { ajaxTry, AjaxTryRes } from "@/util";
import dayjs from "dayjs";

export default defineComponent({
    name: "FinanceDumpList",
    data () {
        return {
            dateType: "month",
            dateOption: [
                { label: "按天查询", value: "date" },
                { label: "按月查询", value: "month" }
            ],
            pickerType: "month",
            dateFormat: "YYYY-MM",
            searchKey: {
                calculateTime: "",
                dateTag: "month"
            }
        };
    },
    setup () {
        return {
            ...useTable()
        };
    },
    created () {
        this.searchKey.calculateTime = this.getCurrentDate("month") as string;
        this.f_getTable(this.searchKey);
    },
    methods: {
        getCurrentDate (type: string) {
            const year = (new Date().getFullYear()).toString();
            let month = (new Date().getMonth() + 1).toString();
            if (Number(month) < 10) {
                month = "0" + month;
            }
            let day = (new Date().getDate()).toString();
            if (Number(day) < 10) {
                day = "0" + day;
            }
            if (type === "date") {
                return year + "-" + month + "-" + day;
            } else if (type === "month") {
                return year + "-" + month;
            }
        },
        changeDateType (val: string) {
            if (val === "date") {
                this.dateFormat = "YYYY-MM-DD";
                this.pickerType = val;
                this.searchKey.calculateTime = this.getCurrentDate(val) as string;
                this.searchKey.dateTag = "";
            } else if (val === "month") {
                this.dateFormat = "YYYY-MM";
                this.pickerType = val;
                this.searchKey.calculateTime = this.getCurrentDate(val) as string;
                this.searchKey.dateTag = val;
            }
        },
        changeDateValue (val: string) {
            this.searchKey.calculateTime = dayjs(val).format(this.dateFormat);
        },
        async f_getTable (data: object): Promise<AjaxTryRes> {
            let [f, r] = await ajaxTry(
                this.axios({
                    ...this.api.financeDump,
                    data: {
                        ...data
                    }
                })
            );
            return this.f_setTable([f, r]);
        }
    }
});
</script>
