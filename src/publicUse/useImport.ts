import { ajaxTry, msg } from "@/util";
import { ComponentPublicInstance, getCurrentInstance, inject, ref } from "vue";
import { AxiosInstance } from "axios";
import { T_refreshTable } from "@/publicUse/useTable";

interface CurrentVM extends ComponentPublicInstance {
    f_refreshTable: T_refreshTable;
}

type T_importFile = (e: any, api: any) => Promise<void>;

export default function () {
    const vm = getCurrentInstance()!.proxy as CurrentVM;
    const axios = inject("axios") as AxiosInstance;

    const importBtnLoading = ref(false);

    const f_importFile: T_importFile = async function (e, api: any) {
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        importBtnLoading.value = true;
        let [f, r] = await ajaxTry(
            axios({
                ...api,
                data: formData
            })
        );
        e.target.value = "";
        msg([f, r]);
        importBtnLoading.value = false;
        if (f) {
            vm.f_refreshTable();
        }

    };
    return {
        f_importFile
    };
}
