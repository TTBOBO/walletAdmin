import { ref, reactive, onMounted, inject, watch } from "vue";
import { ajaxTry, AjaxTryRes } from "@/util";
import { AxiosInstance } from "axios";
import { ElMessage } from "element-plus";
import api from "@/api";

// 创建提币钱包的函数
type F_withdrawalWallet = (x: any) => Promise<AjaxTryRes>;

export default function () {
    const axios = inject("axios") as AxiosInstance;

    const dialog = reactive({ // 定义用于弹窗的响应式对象
        vis: false,
        success: false // 是否提交成功
    });
    const createBtnLoading = ref(false);
    const chainList = ref([]); // 定义链列表
    const currentChain = ref(""); // 当前链
    const successChain = ref(""); // 创建成功的链
    const mnemonic = ref(""); // 助记词
    const password = ref(""); // 密码
    const walletId = ref(""); // 钱包ID
    watch(currentChain, (nv, ov) => {
        if (nv !== ov) {
            mnemonic.value = "";
            password.value = "";
        }
    });

    // 获取链列表
    const f_getChainList = async () => {
        let [f, r] = await ajaxTry(
            axios({
                ...api.chainList
            })
        );
        if (f) {
            chainList.value = r.data;
            currentChain.value = r.data[0];
        } else {
            console.log("链列表获取失败:", r);
        }
    };

    onMounted(f_getChainList); // 组件加载的时候获取可用链列表

    // 创建提币钱包函数
    const f_withdrawalWallet: F_withdrawalWallet = async function () {
        createBtnLoading.value = true;
        let [f, r] = await ajaxTry(
            axios({
                ...api.createACoinWallet,
                data: {
                    chainName: currentChain.value,
                    coinName: currentChain.value,
                    walletId: walletId.value,
                    password: password.value || mnemonic.value
                }
            })
        );
        if (f) {
            dialog.success = true;
            successChain.value = currentChain.value;
            f_getChainList(); // 成功之后需要重新获取链列表
            setTimeout(() => {
                dialog.success = false;
                createBtnLoading.value = false;
            }, 2000);
        } else {
            ElMessage({
                type: "error",
                message: r.message,
                duration: 1500
            });
            createBtnLoading.value = false;
        }
        return [f, r];
    };

    return {
        dialog,
        chainList,
        currentChain,
        successChain,
        mnemonic,
        password,
        walletId,
        createBtnLoading,
        f_withdrawalWallet
    };
}
