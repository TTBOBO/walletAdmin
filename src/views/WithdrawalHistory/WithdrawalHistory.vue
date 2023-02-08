<style lang="stylus" scoped>
.search-wrap {
    margin-bottom: 20px;

    label {
        font-size: 16px;
        color: #333;
    }

    .el-input {
        width: 160px;
        margin-right: 20px;
    }
}
</style>

<template>
    <div class="search-wrap">
        <label>会员编号：</label>
        <el-input size="small" placeholder="会员编号" clearable v-model="searchKey.memberNumber"></el-input>
        <label>提币地址：</label>
        <el-input size="small" placeholder="提币地址" clearable v-model="searchKey.address"></el-input>
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
        <el-table-column prop="memberNumber" label="会员编号" width="160px">
            <template #default="{row}">
                <Ellipsis :con="row.memberNumber"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="提币地址">
            <template #default="{row}">
                <Ellipsis :con="row.address"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column prop="coinName" label="币种名称"></el-table-column>
        <el-table-column
            prop="chainName"
            label="链名称">
        </el-table-column>
        <el-table-column
            prop="amount"
            label="提币数量">
            <template #default="{row}">
                <Ellipsis :con="row.amount"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column label="提币状态">
            <template #default="{row}">{{ parserStatus(row.status) }}</template>
        </el-table-column><el-table-column label="提币来源类型" width="110px">
            <template #default="{row}">{{ formatCoinSourceType(row.type) }}</template>
        </el-table-column>
        <el-table-column prop="txId" label="交易哈希">
            <template #default="{row}">
                <Ellipsis :con="row.txId || '（空）'"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column
            prop="txId"
            label="回填状态">
            <template #default="{row}">{{ row.exported == 0 ? "未回填" : "已回填" }}</template>
        </el-table-column>
        <el-table-column
            prop="operatorUserName"
            width="110px"
            label="转账人用户名">
        </el-table-column>
        <el-table-column
            prop="backfilledUserName"
            width="110px"
            label="回填人用户名">
        </el-table-column>
        <el-table-column
            prop="nonce"
            width="120px"
            label="链上的转账笔数">
        </el-table-column>
        <el-table-column
            prop="tag"
            label="标签">
        </el-table-column>
        <el-table-column
            prop="withdrawId"
            label="提币ID">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170px"></el-table-column>
        <el-table-column prop="fee" label="手续费">
            <template #default="{row}">
                <Ellipsis :con="row.fee"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column prop="withdrawTime" label="提币时间" width="170px"></el-table-column>
        <el-table-column prop="transactionTime" label="转账时间" width="170px"></el-table-column>
    </el-table>

    <el-pagination
        class="page-style"
        background
        @size-change="f_sizeChange"
        @current-change="f_currentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalResult">
    </el-pagination>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useTable from "@/publicUse/useTable";
import { ajaxTry, AjaxTryRes } from "@/util";

export default defineComponent({
    name: "WithdrawalHistory",
    data () {
        return {
            searchKey: {
                memberNumber: "", // 会员编号
                address: "" // 提币地址
            }
        };
    },
    setup () {
        return {
            ...useTable()
        };
    },
    methods: {
        async f_getTable (data: object): Promise<AjaxTryRes> {
            let [f, r] = await ajaxTry(
                this.axios({
                    ...this.api.withdrawalApplicationList,
                    data: {
                        ...data,
                        exported: 1 // 查询历史记录加个状态
                    }
                })
            );
            return this.f_setTable([f, r]);
        },
        parserStatus (s: number) {
            switch (s) {
                case 0:
                    return "交易中";
                case 1:
                    return "成功";
                case 2:
                    return "失败";
                case 3:
                    return "待处理";
            }
        },
        formatCoinSourceType (s: number) {
            switch (s) {
                case 1:
                    return "交易所";
                case 2:
                    return "1024";
            }
        }
    }
});
</script>
