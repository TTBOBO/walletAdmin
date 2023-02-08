import { ajaxTry, AjaxTryRes } from "@/util";
import { AxiosInstance } from "axios";
import {
    inject,
    ref,
    reactive,
    getCurrentInstance,
    onMounted,
    ComponentInternalInstance,
    ComponentPublicInstance
} from "vue";
import { CustomVueInstance, CtxType } from "@/types";

export type T_getTable = (x: any) => Promise<AjaxTryRes>; // 在每个组件内部定义的方法
export type T_setTable = (x: AjaxTryRes) => AjaxTryRes;
export type T_sizeChange = (x: number) => void;
export type T_currentChange = (x: number) => void;
export type T_refreshTable = () => void;
export type T_searchTable = () => void;

interface CurrentVM extends ComponentPublicInstance {
    searchKey?: any; // 查询条件，定义在具体组件内部
    f_getTable: T_getTable;
    f_setTable: T_setTable;
    f_sizeChange: T_sizeChange;
    f_currentChange: T_currentChange;
}

export default function () {
    const axios = inject("axios") as AxiosInstance;
    const vm = getCurrentInstance()!.proxy as CurrentVM;

    let tableData = ref([]); // 创建表格数据
    let tableLoading = ref(true); // 表格加载
    let searchBtnLoading = ref(false); // 查询按钮 loading
    let page = reactive({
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
    }); // 创建分页数据

    onMounted(() => {
        // 得到列表方法由于需要在运行期明确 api 所以在组件内定义
        vm.f_getTable({
            currentPage: 1,
            pageSize: 10
        });

    });

    // 设置表格数据
    const f_setTable: T_setTable = function ([f, r]) {
        tableLoading.value = false; // 停止表格加载动画
        if (!f) {
            console.error(r);
            return [f, r];
        }
        // 设置列表数据

        tableData.value = r.data.list || r.data;
        // 设置分页数据
        page.currentPage = r.data.currentPage;
        page.pageSize = r.data.pageSize;
        page.totalResult = r.data.totalResult;
        return [f, r];

    };

    // 表格刷新
    const f_refreshTable: T_refreshTable = async function () {
        tableLoading.value = true;
        await vm.f_getTable(page);
        tableLoading.value = false;
    };

    // 表格查询
    const f_searchTable: T_searchTable = async function () {
        tableLoading.value = true;
        searchBtnLoading.value = true;
        await vm.f_getTable({
            ...page,
            ...vm.searchKey
        });
        tableLoading.value = false;
        searchBtnLoading.value = false;
    };

    const f_sizeChange: T_sizeChange = function (pageSize) {
        // 每页展示数量变化
        vm.f_getTable({
            currentPage: page.currentPage,
            pageSize
        });
    };

    const f_currentChange: T_currentChange = function (currentPage) {
        vm.f_getTable({
            ...page,
            currentPage
        });
    };

    return {
        tableData,
        page,
        tableLoading,
        searchBtnLoading,
        f_setTable,
        f_sizeChange,
        f_currentChange,
        f_refreshTable,
        f_searchTable
    };

}
