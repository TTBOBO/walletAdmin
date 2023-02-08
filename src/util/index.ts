import { ElMessage } from "element-plus";
import qrcode from "qrcode";
import { CustomVueInstance, CtxType } from "@/types";
import { ComponentPublicInstance } from "vue";

export type AjaxTryRes = [boolean, any]

// promise结果处理工具函数
export function asyncTry (p: Promise<any>): Promise<AjaxTryRes> {
    return p.then(data => [true, data]).catch(err => [false, err]) as Promise<AjaxTryRes>;
}

// ajax结果处理工具函数
export function ajaxTry (p: Promise<any>): Promise<AjaxTryRes> {
    return p.then(res => {
        if (res.code === 200) {
            return [true, res];
        } else {
            return [false, res];
        }
    }, err => {
        return [false, err];
    });
}

export function msg ([flag, res]: AjaxTryRes): Promise<void> {

    return new Promise(resolve => ElMessage({
        type: flag ? "success" : "error",
        message: res.message,
        duration: 1500,
        onClose: () => resolve()
    }));
}

// 用于生成二维码
export async function generateQRCode (str: string) {
    return await asyncTry(qrcode.toDataURL(str));
}

// 转换getCurrentInstance返回的结果的类型
export function convertToVM (instance: any): ComponentPublicInstance {
    return instance.proxy as ComponentPublicInstance;
}
