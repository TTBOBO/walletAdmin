import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        name: "Login",
        meta: { match: "login" },
        component: () => import(/* webpackChunkName: "login" */ "@/views/Login/Login.vue")
    },
    {
        path: "/withdrawal-wallet-manage", // 提币钱包管理
        name: "WithdrawalWalletManage",
        meta: { match: "WithdrawalWalletManage" },
        component: () => import(/* webpackChunkName: "WithdrawalWalletManage" */ "../views/WithdrawalWalletManage/WithdrawalWalletManage.vue")
    },
    {
        path: "/withdraw-manage", // 提币管理
        name: "WithdrawManage",
        meta: { match: "WithdrawManage" },
        component: () => import(/* webpackChunkName: "WithdrawManage" */ "../views/WithdrawManage/WithdrawManage.vue")
    },
    {
        path: "/withdrawal-history", // 提币历史
        name: "WithdrawalHistory",
        meta: { match: "WithdrawalHistory" },
        component: () => import(/* webpackChunkName: "WithdrawalHistory" */ "../views/WithdrawalHistory/WithdrawalHistory.vue")
    },
    {
        path: "/finance-dump-list", // 财务转储统计
        name: "FinanceDumpList",
        component: () => import(/* webpackChunkName: "FinanceDump" */ "../views/FinanceDump/FinanceDumpList.vue")
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
