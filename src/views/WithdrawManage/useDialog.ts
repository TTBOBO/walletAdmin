import { ComponentPublicInstance, getCurrentInstance, inject, ref, watch, reactive } from "vue";
import { AxiosInstance } from "axios";
import { ajaxTry, asyncTry, msg } from "@/util";
import { T_refreshTable } from "@/publicUse/useTable";
import api from "@/api";

type T_confirmTransfer = () => void;
type T_speedUp = (x: any) => void;

interface CurrentVM extends ComponentPublicInstance {
    currentRow: any;
    f_refreshTable: T_refreshTable;
}

export default function () {
    /* 响应式数据 - 开始 */
    const dialogVis = ref(false);
    const dialogSpeedUpVis = ref(false);
    const confirmBtnLoading = ref(false); // 确认按钮
    const fee = ref(0); // 手续费，根据接口返回
    const step = ref(0); // 步进
    const bigFee = ref(0); // 最大手续费
    const smallFee = ref(0); // 最小手续费
    const coinSourceType = reactive([{
        value: 1,
        label: "交易所"
    }, {
        value: 2,
        label: "1024"
    }]);
    const ruleForm = reactive({
        withdrawId: "",
        type: ""
    });
    const dialogRevokeVis = ref(false); // 撤销弹框
    const revokeBtnLoading = ref(false); // 撤销按钮 loading
    const rules = reactive({
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        withdrawId: [{ required: true, message: "请输入提币ID", trigger: "blur" }]
    });
    let ruleFormRef = ref(null);
    /* 响应式数据 - 结束 */

    const axios = inject("axios") as AxiosInstance;
    const vm = getCurrentInstance()!.proxy as CurrentVM;

    watch(dialogVis, async (nv, ov) => {
        if (!nv) return;
        let [f, r] = await ajaxTry(
            axios({
                ...api.getTransferFee,
                data: {
                    chainName: vm.currentRow.chainName,
                    coinName: vm.currentRow.coinName
                }
            })
        );
        if (f) {
            fee.value = parseFloat(r.data.defaultFee);
            smallFee.value = parseFloat(r.data.smallFee);
            bigFee.value = parseFloat(r.data.bigFee);
            step.value = (bigFee.value - smallFee.value) / 1000;
        }

    });

    watch(dialogSpeedUpVis, async (nv, ov) => {
        if (!nv) return;
        let [f, r] = await ajaxTry(
            axios({
                ...api.searchFee,
                data: {
                    chainName: vm.currentRow.chainName,
                    coinName: vm.currentRow.coinName,
                    txId: vm.currentRow.txId
                }
            })
        );
        if (f) {
            fee.value = parseFloat(r.data.defaultFee);
            smallFee.value = parseFloat(r.data.smallFee);
            bigFee.value = parseFloat(r.data.bigFee);
            step.value = (bigFee.value - smallFee.value) / 1000;
        }

    });

    // 点击对话框的确认转账
    const f_confirmTransfer: T_confirmTransfer = async function () {
        confirmBtnLoading.value = true; // 即将请求确认按钮 loading
        let params: any = {
            id: vm.currentRow.id,
            chainName: vm.currentRow.chainName,
            coinName: vm.currentRow.coinName
        };
        if (vm.currentRow.chainName.toLowerCase() === "eth") {
            params.fee = fee.value;
        }
        let [f, r] = await ajaxTry(
            axios({
                ...api.transfer,
                data: params
            })
        );
        msg([f, r]);
        confirmBtnLoading.value = false;
        if (f) {
            dialogVis.value = false;
            vm.f_refreshTable();
        }

    };

    // 点击加速对话框的确认加速
    const speedUp_confirmTransfer: T_speedUp = async function () {
        // 加速
        // 请求手续费最大值
        let params: any = {
            id: vm.currentRow.id,
            chainName: vm.currentRow.chainName,
            coinName: vm.currentRow.coinName,
            fee: bigFee.value
        };
        let [f, r] = await ajaxTry(
            axios({
                ...api.transfer,
                data: params
            })
        );
        msg([f, r]);
        confirmBtnLoading.value = false;
        if (f) {
            dialogSpeedUpVis.value = false;
            vm.f_refreshTable();
        }
    };

    // 点击撤销对话框的确认按钮
    const revoke_confirm = async function () {
        console.log(ruleForm);
        
        (ruleFormRef as any).value.validate(async (valid: any) => {
            if (valid) {
                revokeBtnLoading.value = true;

                let params: any = ruleForm;
                let [f, r] = await ajaxTry(
                    axios({
                        ...api.revoke,
                        data: params
                    })
                );
                msg([f, r]);
                revokeBtnLoading.value = false;
                if (f) {
                    dialogRevokeVis.value = false;
                    (ruleFormRef as any).value.resetFields();
                    vm.f_refreshTable();
                }
            }
        });
    };

    // 点击撤销对话框的取消按钮
    const revoke_cancel = async function () {
        dialogRevokeVis.value = false;
        (ruleFormRef as any).value.resetFields();
    };

    return {
        step,
        fee,
        bigFee,
        smallFee,
        dialogVis,
        dialogSpeedUpVis,
        confirmBtnLoading,
        f_confirmTransfer,
        speedUp_confirmTransfer,
        coinSourceType,
        dialogRevokeVis,
        revoke_confirm,
        revoke_cancel,
        revokeBtnLoading,
        rules,
        ruleForm,
        ruleFormRef
    };
}
