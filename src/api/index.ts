import { Method } from "axios";

// 定义导出对象类型
export interface ApiConfig {
    [propName: string]: {
        url: string;
        method: Method;
    };
}

export default {
    login: { // 登录
        url: "/wallet/admin/sign/in",
        method: "post"
    },
    sendSms: { // 获取验证码
        url: "/wallet/admin/sendSms",
        method: "get"
    },
    changePassword: {
        url: "/wallet/admin/updatePassword", // 修改密码
        method: "post"
    },
    logOut: {
        url: "/wallet/admin/logout", // 退出登录
        method: "post"
    },
    queryWithdrawalAddress: { // 查询提币钱包地址
        url: "/wallet/withdrawAddress/queryPage",
        method: "get"
    },
    chainList: { // 查询链列表
        url: "/wallet/common/selectWithdrawChainList",
        method: "get"
    },
    createACoinWallet: { // 创建提币钱包
        url: "/wallet/withdrawAddress/withdrawAddress",
        method: "post"
    },
    flowQuery: {
        url: "/wallet/withdrawAddress/getBlockbrowserLink",
        method: "get"
    },
    withdrawalApplicationList: { // 提币申请列表
        url: "/wallet/withdraw/queryPage",
        method: "post"
    },
    transfer: { // 转账
        url: "/wallet/withdraw/transfer",
        method: "put"
    },
    backfill: { // 提币管理-回填
        url: "/wallet/withdraw/withdraw",
        method: "put"
    },
    withdrawalImport: { // 提币-导入
        url: "/wallet/withdraw/importWithdraw",
        method: "post"
    },
    withdrawalExport: { // 提币管理-导出
        url: "/wallet/withdraw/exportWithdraw",
        method: "get"
    },
    searchFee: {
        url: "/wallet/withdraw/getFee",
        method: "post"
    },
    getTransferFee: {
        url: "/wallet/withdraw/getTransferFee",
        method: "post"
    },
    revoke: {
        url: "/wallet/withdraw/withdraw",
        method: "post"
    },
    financeDump: { // 财务转储统计
        url: "/wallet/withdraw/dilyReport",
        method: "post"
    },
    withdrawal1024Export: { // 提币管理-1024导出
        url: "/wallet/withdraw/mine/exportWithdraw",
        method: "get"
    },
    withdrawal1024Import: { // 提币-1024导入
        url: "/wallet/withdraw/mine/importWithdraw",
        method: "post"
    }
} as ApiConfig;
