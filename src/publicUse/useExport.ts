import { exportFileByAjax } from "@/util/export";
import { inject } from "vue";
import { AxiosInstance } from "axios";

type T_exportFile = (x: any, y: any) => Promise<void>

export default function () {
    const axios = inject("axios") as AxiosInstance;

    const f_exportFile: T_exportFile = async function (api, fileName) {
        exportFileByAjax(axios({
            ...api,
            responseType: "blob"
        }), fileName);
    };
    return {
        f_exportFile
    };
}
