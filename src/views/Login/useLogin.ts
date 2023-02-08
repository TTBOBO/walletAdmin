import { ref, inject } from "vue";
import { AxiosInstance } from "axios";
import { ajaxTry, AjaxTryRes, msg } from "@/util";
import { useRouter } from "vue-router";
import api from "@/api";

type LoginHandle = () => void; // 登录函数类型
type codeHandle = () => void; // 登录函数类型

export default function useLogin () {
    let username = ref<string>(""); // 用户名
    let password = ref<string>(""); // 密码
    let phone = ref<string>(""); // 手机号
    let code = ref<string>(""); // 验证码
    let checkRemember = ref<boolean>(true); // 是否技术用户密码
    let btnLoading = ref<boolean>(false); // 登录按钮是否loading
    const router = useRouter();

    const axios = inject("axios") as AxiosInstance;
    let f_login: LoginHandle = async () => {
        btnLoading.value = true;
        let [f, r]: AjaxTryRes = await ajaxTry(
            axios({
                ...api.login,
                data: {
                    username: username.value,
                    password: password.value,
                    phone: phone.value,
                    code: code.value
                }
            })
        );
        await msg([f, r]);

        if (f) {
            // 向本地设置用户名
            localStorage.setItem("username", username.value);
            router.push("/withdrawal-wallet-manage");
        } else {
            btnLoading.value = false;
        }
    };
    let sendVerify = async ($event: { startCount: () => void; sendFail: () => void }) => {
        let [f, r]: AjaxTryRes = await ajaxTry(
            axios({
                ...api.sendSms,
                url: api.sendSms.url + "?phone=" + phone.value
            })
        );
        await msg([f, r]);
        if (f) {
            $event.startCount();
        } else {
            $event.sendFail();
        }
    };
    return {
        username,
        password,
        phone,
        code,
        checkRemember,
        btnLoading,
        f_login,
        sendVerify
    };
}
