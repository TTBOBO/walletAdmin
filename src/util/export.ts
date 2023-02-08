import { ElLoading as Loading, ElMessage } from "element-plus";
import isIE from "./isIE";
import { ajaxTry } from "@/util/index";
import Message from "element-plus/lib/el-message";
// 导出工具
// 下载 excel 表格工具函数
function getDate () {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const seccond = dateObj.getSeconds();
    const result = year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分" + seccond + "秒";
    return result;
}
export function downloadExcel (excelBlob: Blob, fileName: string) {
    return new Promise((resolve, reject) => {
        if (isIE()) {
            window.navigator.msSaveOrOpenBlob(excelBlob, fileName + "-" + getDate() + ".xlsx");
            resolve("下载成功");
        } else {
            let reader = new FileReader();
            reader.onload = (e: any) => { // 文件读取结束

                let aDom = document.createElement("a");
                aDom.download = fileName + "-" + getDate() + ".xlsx";
                aDom.href = e.target.result;
                aDom.style.display = "none";
                document.body.appendChild(aDom);
                aDom.click();
                document.body.removeChild(aDom);
                resolve("下载成功");
            };
            reader.onabort = () => {
                reject(new Error("用户终止读取"));
            };
            reader.onerror = () => { // 文件读取失败
                reject(reader.error);
            };
            let excelFile = new File([excelBlob], "", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

            reader.readAsDataURL(excelFile);
        }
    });

}

// 根据ajax导出文件
export async function exportFileByAjax (ajaxP: Promise<any>, fileName: string) {
    const loading = Loading.service({
        lock: true,
        text: "下载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        customClass: "table-downloading"
    });
    let [, resData] = await ajaxTry(ajaxP);
    console.log("导出接口返回数据");
    console.log(resData);
    if (resData.type.indexOf("application/json") !== -1) {
        // let reader = new FileReader();
        // reader.onload = (e: any) => {
        //     try {
        //         let result = JSON.parse(e.target.result);
        //         ElMessage({
        //             type: result.data ? "success" : "error",
        //             message: result.message,
        //             duration: 1500
        //         });
        //         // Alert(result.message, "下载失败", { type: "error" })
        //     } catch (e) {
        //         console.error(e);
        //     }

        //     loading.close();

        // };
        // reader.readAsText(resData.data);

        ElMessage({
            type: "error",
            message: "没有数据",
            duration: 1500
        });
        loading.close();
    } else {
        downloadExcel(resData, fileName).then(() => {
            loading.close();
        });
    }
}
