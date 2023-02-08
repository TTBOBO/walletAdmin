import Mock from "mockjs";
import api from "@/api";

function log (params: object, result: any): any {
    console.log(`%cAjax请求:%o%c %c返回值:%o`, "background: #67C23A;color: #fff;border-radius: 3px;padding: 3px 5px;", params, "background: #fff;", "background: #409EFF;color: #fff;border-radius: 3px;padding: 3px 5px;", result);
    return result;
}

Mock.setup({
    timeout: 600
});

// 查询提币钱包地址
Mock.mock(api.queryWithdrawalAddress.url, api.queryWithdrawalAddress.method, function (params: any) {

    let result = Mock.mock({
        code: 200,
        message: "SUCCESS",
        data: {
            pageSize: 10,
            totalPage: 1,
            totalResult: 100,
            currentPage: 1,
            currentResult: 0,
            pageStr: null,
            "list|10": [{
                id: "@id",
                address: "@province@city@county@zip 号", // 地址
                "balance|100-10000.100-1000": 0, // 余额
                "chainName|3-4": "@character('upper')", // 链名称
                "coinName|3-4": "@character('upper')", // 币名称
                createTime: "@date(yyyy-MM-dd)", // 创建时间
                updateTime: "@date(yyyy-MM-dd)", // 更新时间
                "remark|5-8": "@title" // 备注
            }]
        }

    });
    return log(params, result);
});

// 查询链列表
Mock.mock(api.chainList.url, api.chainList.method, function (params: object) {

    let result = Mock.mock({
        code: 200,
        "data|6": [
            {
                "label|+1": ["BTC", "ETH", "BIPT", "ADA", "ABC", "BCD"],
                value: "@label",
                "type|1-2": 1 // 1:输入助记词  2：输入密码
            }
        ],
        message: "SUCCESS",
        time: 1608608924068
    });
    return log(params, result);
});

// 创建提币钱包地址
Mock.mock(api.createACoinWallet.url, api.createACoinWallet.method, function (params: object) {
    let result = Mock.mock({
        code: 200,
        message: "SUCCESS",
        time: 1608617500006,
        data: null
    });
    return log(params, result);
});

// 提币管理-导入
Mock.mock(api.withdrawalImport.url, api.withdrawalImport.method, function (params: object) {

    let result = {
        code: 200,
        message: "SUCCESS",
        time: 1608603150057,
        data: null
    };

    return log(params, result);
});

// 提币申请列表
Mock.mock(api.withdrawalApplicationList.url, api.withdrawalApplicationList.method, function (params: object) {
    let result = Mock.mock({
        code: 200,
        message: "SUCCESS",
        time: 1608605010191,
        data: {
            pageSize: 10,
            totalPage: 1,
            totalResult: 1,
            currentPage: 1,
            currentResult: 0,
            pageStr: null,
            "list|10": [
                {
                    id: 1, //
                    "memberNumber|10": "@integer(0,9)", // 会员编号
                    "address|24": "", // 提币地址
                    "coinName|3-4": "@character('upper')", // 币种名称
                    "chainName|3-4": "@character('upper')", // 链名称
                    amount: 12, // 提币数量
                    status: 3, // 提币状态  0: 交易中 1: 成功 2: 失败  3：待处理
                    txId: null, // 交易哈希
                    exported: false, // 回填状态  0：未回填 1：已回填
                    withdrawId: 9, // 提币ID
                    createTime: null, // 创建时间
                    updateTime: null, //
                    fee: null, // 手续费
                    withdrawTime: "@date('yyyy-MM-dd HH:mm:ss')", // 提币时间
                    transactionTime: null // 转账时间
                }
            ]
        }
    });
    return log(params, result);
});

// 转账
Mock.mock(api.transfer.url, api.transfer.method, function (params: object) {

    let result = {
        code: 200,
        message: "SUCCESS",
        time: 1608617500006,
        data: null
    };
    return log(params, result);
});

// 流水查询
let flowQueryUrl = api.flowQuery.url + "/.*";

Mock.mock(new RegExp(flowQueryUrl), api.flowQuery.method, function (params: object) {
    let result = {
        code: 200,
        data: {
            url: "http://mainnet.mazbipt.com/addressDetail?address=15bYYwAe7329R9UM5LLByur8D5f5CcGm7U"
        },
        message: "SUCCESS",
        time: 1609313415375
    };
    return log(params, result);
});

// 提币管理-回填
Mock.mock(api.backfill.url, api.backfill.method, function (params: object) {

    let result = {
        code: 200,
        message: "SUCCESS",
        time: 1608617500006,
        data: null
    };
    return log(params, result);
});

// 提币管理- 导出
Mock.mock(api.withdrawalExport.url, api.withdrawalExport.method, function (params: object) {

    let result = {
        code: 200,
        message: "SUCCESS"
    };
    return log(params, result);
});
