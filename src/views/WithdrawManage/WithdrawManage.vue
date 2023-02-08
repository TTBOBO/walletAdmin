<style lang="stylus" scoped>
.el-col {
    font-size: 16px;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.el-row:not(:last-child) {
    margin-bottom: 10px;
}

.col-label {
    text-align: right;
}

.export-btn {
    margin: 0 20px;
    display: inline-block;
    position: relative;
    top: 0;
    left: 0;

    input {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0;
        font-size: 0;
        z-index: 10;
        cursor: pointer;
    }

}

.query-btn {
    width: 80px;
    height: 28px;
    line-height: 28px;
    background: #409EFF;
    margin-left: 10px;
    color: #fff;
    display: inline-block;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    font-size: 12px;

    &:hover {
        background: #66b1ff;
    }
}

.query-btn-gray {
    background: #979797;
    color: #fff;
    cursor: not-allowed;

    &:hover {
        background: #979797;
    }
}
</style>

<template>
    <div style="margin-bottom: 20px;">
        <el-button type="primary"
                   size="small"
                   @click="f_exportFile(api.withdrawalExport, '财务导出')"
                   icon="el-icon-upload2">交易所导出
        </el-button>
        <div class="export-btn">
            <input type="file" ref="file" @change="fileChange">
            <el-button type="primary" size="small" icon="el-icon-download">交易所导入</el-button>
        </div>
        <el-button type="primary"
                   size="small"
                   @click="f_exportFile(api.withdrawal1024Export, '1024导出')"
                   icon="el-icon-upload2">1024导出
        </el-button>
        <div class="export-btn">
            <input type="file" ref="file" @change="file1024Change">
            <el-button type="primary" size="small" icon="el-icon-download">1024导入</el-button>
        </div>
        <el-button type="primary"
                   size="small"
                   :loading="backfillBtnLoading"
                   @click="f_backfill"
                   icon="el-icon-edit-outline">回 填
        </el-button>
        <el-button type="primary"
                   size="small"
                   :loading="revokeBtnLoading"
                   @click="f_revoke"
                   icon="el-icon-bottom-left">撤销
        </el-button>
    </div>

    <el-table
        :data="tableData"
        v-loading="tableLoading"
        @selection-change="tableSelect"
        border
        style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="memberNumber"
            label="会员编号">
            <template #default="{row}">
                <Ellipsis :con="row.memberNumber"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column
            prop="memberName"
            label="会员名称">
            <template #default="{row}">
                <Ellipsis :con="row.memberName"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column
            prop="address"
            label="钱包地址">
            <template #default="{row}">
                <Ellipsis :con="row.address"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column
            prop="amount"
            label="提币数量">
            <template #default="{row}">
                <Ellipsis :con="row.amount"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column
            prop="chainName"
            label="所属主链">
        </el-table-column>
        <el-table-column
            prop="txId"
            label="交易哈希">
            <template #default="{row}">
                <Ellipsis :con="row.txId"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column
            prop="coinName"
            label="提币币种">
        </el-table-column>
        <el-table-column
            prop="withdrawId"
            label="提币ID">
        </el-table-column>
        <el-table-column
            prop="status"
            label="提币状态">
            <template #default="{row}">
                {{ parserStatus(row.status) }}
            </template>
        </el-table-column>
        <el-table-column label="提币来源类型" width="110px">
            <template #default="{row}">{{ formatCoinSourceType(row.type) }}</template>
        </el-table-column>
        <el-table-column
            prop="operatorUserName"
            width="110px"
            label="转账人用户名">
        </el-table-column>
        <!-- <el-table-column
            prop="backfilledUserName"
            width="110px"
            label="回填人用户名">
        </el-table-column> -->
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
            prop="exported"
            label="回填状态">
            <template #default="{row}">
                {{ parserBackfill(row.exported) }}
            </template>
        </el-table-column>
        <el-table-column
            prop="withdrawTime"
            label="提币时间">
            <template #default="{row}">
                <Ellipsis :con="row.withdrawTime"></Ellipsis>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
            <template #default="{row}">
                <el-button type="primary"
                           size="mini"
                           :disabled="row.status != 3"
                           @click="f_transfer(row)">转 账
                </el-button>
                <el-button
                    v-if="row.chainName == 'ETH'"
                    type="primary"
                    size="mini"
                    :disabled="row.status != 0"
                    @click="f_speedUp(row)">加速
                </el-button>
                <a
                    :href="row.url == '' ? null : row.url"
                    class="query-btn"
                    :class="row.url== ''? 'query-btn-gray': ''"
                    target="_blank">区块查询
                </a>
            </template>
        </el-table-column>
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

    <el-dialog
        title="确认转账"
        v-model="dialogVis"
        :close-on-click-modal="false"
        width="580px">
        <el-row>
            <el-col class="col-label" :span="5" :offset="1">会员编号：</el-col>
            <el-col :span="18">{{ currentRow.memberNumber }}</el-col>
        </el-row>
        <el-row>
            <el-col class="col-label" :span="5" :offset="1">提币数量：</el-col>
            <el-col :span="18">{{ currentRow.amount }}</el-col>
        </el-row>
        <el-row>
            <el-col class="col-label" :span="5" :offset="1">提币币种：</el-col>
            <el-col :span="18">{{ currentRow.coinName }}</el-col>
        </el-row>
        <el-row>
            <el-col class="col-label" :span="5" :offset="1">所属主链：</el-col>
            <el-col :span="18">{{ currentRow.chainName }}</el-col>
        </el-row>
        <el-row>
            <el-col class="col-label" :span="5" :offset="1">提币地址：</el-col>
            <el-col :span="18">{{ currentRow.address }}</el-col>
        </el-row>
        <el-row>
            <el-col class="col-label" :span="5" :offset="1">申请提币时间：</el-col>
            <el-col :span="18">{{ currentRow.withdrawTime }}</el-col>
        </el-row>
        <el-row>
            <el-col class="col-label" :span="5" :offset="1">提币状态：</el-col>
            <el-col :span="18">{{ parserStatus(currentRow.status) }}</el-col>
        </el-row>
        <el-row v-if="currentRow.chainName.toLowerCase() == 'eth'">
            <el-col class="col-label" :span="5" :offset="1">手续费：</el-col>
            <el-col :span="18">
                <el-slider
                    :max="bigFee"
                    :step="step"
                    :min="smallFee"
                    show-input
                    :show-input-controls="false"
                    v-model="fee">
                </el-slider>
            </el-col>
        </el-row>
        <template #footer>
            <span class="dialog-footer">
              <el-button size="small" @click="dialogVis = false">取 消</el-button>
              <el-button size="small" type="primary"
                         :loading="confirmBtnLoading"
                         @click="f_confirmTransfer">确 定</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog
        title="温馨提示"
        v-model="dialogSpeedUpVis"
        :close-on-click-modal="false"
        width="420px">
        <el-slider
            :max="bigFee"
            :step="step"
            :min="smallFee"
            show-input
            :show-input-controls="false"
            v-model="fee">
        </el-slider>
        <div>确认加速至{{fee}}?</div>
        <template #footer>
            <span class="dialog-footer">
              <el-button size="small" @click="dialogSpeedUpVis = false">取 消</el-button>
              <el-button size="small" type="primary"
                         :loading="confirmBtnLoading"
                         @click="speedUp_confirmTransfer">确 定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 撤销 -->
    <el-dialog
        title="撤销"
        v-model="dialogRevokeVis"
        :close-on-click-modal="false"
        width="420px"
        @closed="revoke_cancel">
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" inline>
            <el-form-item label="提币来源类型" prop="type" label-width="110px">
                <el-select v-model="ruleForm.type" placeholder="请选择类型">
                    <el-option
                        v-for="item in coinSourceType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提币ID" prop="withdrawId" label-width="110px">
                <el-input v-model="ruleForm.withdrawId" placeholder="请输入提币ID"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
              <el-button size="small" @click="revoke_cancel">取 消</el-button>
              <el-button size="small" type="primary"
                         :loading="confirmBtnLoading"
                         @click="revoke_confirm">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useTable from "@/publicUse/useTable";
import useDialog from "./useDialog";
import useImport from "@/publicUse/useImport";
import useExport from "@/publicUse/useExport";
import { ajaxTry, AjaxTryRes, asyncTry, msg } from "@/util";
import { ElMessageBox } from "element-plus";

export default defineComponent({
    name: "WithdrawManage",
    data () {
        return {
            currentRow: {},
            ids: [], // 记录选中条目的id数组
            backfillBtnLoading: false // 回填按钮loading
        };
    },
    setup () {
        return {
            ...useTable(),
            ...useDialog(),
            ...useImport(),
            ...useExport()
        };
    },
    methods: {
        async f_getTable (data: object): Promise<AjaxTryRes> {
            let [f, r] = await ajaxTry(
                this.axios({
                    ...this.api.withdrawalApplicationList,
                    data: {
                        ...data,
                        exported: 0
                    }
                })
            );
            return this.f_setTable([f, r]);
        },
        f_transfer (row: any) {
            this.dialogVis = true;
            this.currentRow = row;
        },
        f_speedUp (row: any) {
            this.dialogSpeedUpVis = true;
            this.currentRow = row;
        },
        tableSelect (args: any) {
            this.ids = args.map((row: any) => row.id);
        },
        async f_backfill () {
            if (!this.ids.length) {
                ElMessageBox("请至少选择一项", "警告");
                return;
            }
            let [flag] = await asyncTry(
                ElMessageBox.confirm("确认回填吗？", "提示")
            );
            if (!flag) return;
            this.backfillBtnLoading = true; // 回填按钮 loading
            let [f, r] = await ajaxTry(
                this.axios({
                    ...this.api.backfill,
                    data: {
                        ids: this.ids,
                        exported: true
                    }
                })
            );
            this.backfillBtnLoading = false; // 回填按钮 loading 重置
            msg([f, r]);
            if (f) {
                this.f_refreshTable();
            }

        },
        async f_revoke () {
            // 撤销
            this.dialogRevokeVis = true;
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
        },
        parserBackfill (b: boolean) {
            switch (b) {
                case true:
                    return "已回填";
                case false:
                    return "未回填";
            }
        },
        fileChange (e: any) {
            this.f_importFile(e, this.api.withdrawalImport);
        },
        file1024Change (e: any) {
            this.f_importFile(e, this.api.withdrawal1024Import);
        }

    }
});
</script>
