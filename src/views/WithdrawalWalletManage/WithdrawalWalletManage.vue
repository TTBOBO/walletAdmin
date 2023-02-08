<style lang="stylus" scoped>
.dialog-tip {
    font-size: 16px;
    color: #333;
    margin-bottom: 30px;
    margin-top: 60px;
    transition: all .2s;
}

.dialog-tip-success {
    margin-top: 20px;
}

// 助记词
.mnemonic {
    margin-top: 15px;
}

.mnemonic-tip {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

// 钱包密码
.wallet-pass {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;

    label {
        width: 120px;
        margin-right: 5px;
    }

    .el-input {
        width: 220px;
    }
}

// 对话框
.dialog-shadow {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.dialog-box {
    width: 580px;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    top: 0;
    left: 0;
}

.dialog-title {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .iconfont {
        cursor: pointer;
    }
}

.dialog-title-success {
    color: #fff;
}

// 对话框成功提示
.dialog-success {
    margin: -20px -20px 0 -20px;
    transition: all .2s;
    background: _mainc;
    overflow: hidden;
    height: 0;
}

.dialog-success-active {
    height: 200px;
}

.dialog-success-tip {
    color: #fff;
    font-size: 16px;
    text-align: center;
    margin: 20px auto 0;
}

.true-icon {
    width: 60px;
    height: 60px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 46px;
    color: _mainc;
    margin: 60px auto 0;
}

.btn-wrap {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.el-radio {
    margin-bottom: 15px;
}

.query-btn {
    width: 80px;
    height: 28px;
    line-height: 28px;
    background: #409EFF;
    color: #fff;
    display: block;
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
    <div style="margin-bottom: 20px;" v-if="chainList.length">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="dialog.vis = true">创建提币钱包
        </el-button>
    </div>

    <el-table
        :data="tableData"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
            prop="address"
            label="钱包地址">
        </el-table-column>
        <el-table-column label="钱包地址二维码" width="150">
            <template #default="{ row }">
                <el-image
                    style="width: 30px; height: 30px;"
                    :src="row.qrcode"
                    :preview-src-list="[row.qrcode]"></el-image>
            </template>
        </el-table-column>
        <el-table-column
            prop="balance"
            label="钱包余额">
        </el-table-column>
        <el-table-column
            prop="coinName"
            label="币种">
        </el-table-column>
        <el-table-column
            prop="chainName"
            label="所属主链">
        </el-table-column>
        <el-table-column
            prop="updateTime"
            label="最近区块查询时间">
        </el-table-column>
        <el-table-column label="操作">
            <template #default="{row}">
                <a
                    :href="unCoins.includes(row.coinName) ? null : row.url"
                    class="query-btn"
                    :class="unCoins.includes(row.coinName) ? 'query-btn-gray': ''"
                    target="_blank">流水查询
                </a>
                <!--                <el-button type="primary" size="mini" :loading="row.btnLoading" @click="f_flowQuery(row)">流水查询-->
                <!--                </el-button>-->
            </template>
        </el-table-column>
    </el-table>

    <!--    <el-pagination-->
    <!--        class="page-style"-->
    <!--        background-->
    <!--        @size-change="f_sizeChange"-->
    <!--        @current-change="f_currentChange"-->
    <!--        :current-page="page.currentPage"-->
    <!--        :page-sizes="[10, 20, 30]"-->
    <!--        :page-size="page.pageSize"-->
    <!--        layout="total, sizes, prev, pager, next, jumper"-->
    <!--        :total="page.totalResult">-->
    <!--    </el-pagination>-->

    <!--  创建提币钱包弹窗 - 开始  -->
    <teleport to="body">
        <transition
            appear
            enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut">
            <div class="dialog-shadow" v-show="dialog.vis">
                <transition
                    appear
                    enter-active-class="animate__animated animate__zoomInDown"
                    leave-active-class="animate__animated animate__zoomOut">

                    <div class="dialog-box" v-show="dialog.vis">
                        <h2 :class="{'dialog-title': true,'dialog-title-success': dialog.success}">
                            <span>创建提币钱包</span>
                            <i class="iconfont iconclose" @click="dialog.vis = false"></i>
                        </h2>
                        <!-- 提示操作成功 - 开始 -->
                        <div class="dialog-success"
                             :class="dialog.success ? 'dialog-success-active': ''">
                            <div class="true-icon iconfont iconzhengque"></div>
                            <div class="dialog-success-tip">恭喜，{{ successChain }}链提币钱包创建成功！</div>
                        </div>
                        <!-- 提示操作成功 - 结束 -->
                        <div class="dialog-tip"
                             :class="dialog.success && 'dialog-tip-success'">请选择链开始创建提币钱包，单次只能选择一条链</div>
                        <el-radio-group class="radio-wrap" v-model="currentChain" v-if="chainList.length">
                            <el-radio v-for="chain in chainList" :label="chain.value" :key="chain.value">
                                {{ chain.label }}
                            </el-radio>
                        </el-radio-group>
                        <div class="wallet-pass" v-if="currentChain == 'ADA'">
                            <label>钱包ID:</label>
                            <el-input size="medium" show-password v-model="walletId"></el-input>
                        </div>
                        <div class="mnemonic" v-if="currentChain == 'BTC' || currentChain == 'ETH'">
                            <div class="mnemonic-tip">请按顺序输入助记词</div>
                            <el-input type="textarea" v-model="mnemonic"></el-input>
                        </div>
                        <div class="wallet-pass" v-else>
                            <label>请输入钱包密码:</label>
                            <el-input size="medium" show-password v-model="password"></el-input>
                        </div>
                        <div class="btn-wrap">
                            <el-button type="primary" size="small" style="width: 200px;"
                                       @click="f_withdrawalWallet"
                                       :loading="createBtnLoading">
                                开始创建
                            </el-button>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>

    </teleport>
    <!--  创建提币钱包弹窗 - 结束  -->

    <!--  流水查询网站 - 开始  -->
    <el-dialog title="流水查询"
               v-model="streamVis"
               width="80%"
               :center="true"
               :fullscreen="true"
               :destroy-on-close="true"
               :append-to-body="true">
        <iframe :src="streamUrl" frameborder="0" style="width: 100%;height: 600px;"></iframe>
    </el-dialog>
    <!--  流水查询网站 - 结束  -->

</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, getCurrentInstance, inject, ref } from "vue";
import useTable from "@/publicUse/useTable";
import useDialog from "./useDialog";
import { ajaxTry, AjaxTryRes, generateQRCode } from "@/util";
import { AxiosInstance } from "axios";
import api from "@/api";

type F_flowQuery = (x: any) => void;

export default defineComponent({
    name: "WithdrawalWalletManage",
    data () {
        return {
            unCoins: ["XMR"] // 这里的币种不跳转
        };
    },
    setup () {
        // 定义流水页面显示vis
        let streamVis = ref(false);
        // 定义流水页面url
        let streamUrl = ref("");
        // 流水查询
        const axios = inject("axios") as AxiosInstance;
        const f_flowQuery: F_flowQuery = async (row) => {
            row.btnLoading = true;
            let [f, r] = await ajaxTry(
                axios({
                    ...api.flowQuery,
                    url: api.flowQuery.url + "/" + row.address
                })
            );
            if (r) {
                streamVis.value = true;
                streamUrl.value = r.data.url;
                row.btnLoading = false;
            }

        };
        return {
            ...useTable(),
            ...useDialog(),
            streamUrl,
            streamVis,
            f_flowQuery
        };
    },
    methods: {
        async f_getTable (data: object): Promise<AjaxTryRes> {
            let [f, r] = await ajaxTry(
                this.axios({
                    ...this.api.queryWithdrawalAddress,
                    data
                })
            );
            this.f_setTable([f, r]);
            this.tableData.forEach(async (row: any) => {
                let [, r] = await generateQRCode(row.address);
                row.qrcode = r;
                row.btnLoading = false;
            });
            return [f, r];
        }
    }
});
</script>
