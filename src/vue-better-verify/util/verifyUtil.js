// 创建应用于第一次与之后的事件绑定函数
export function bindEventFirstAndLater (dom, eventName, firstFn, laterFn) {
    let tempFn = function () {
        firstFn.apply(this, arguments);
        // 取消事件绑定
        dom.removeEventListener(eventName, tempFn, false);
        // 重新绑定事件
        dom.addEventListener(eventName, laterFn, false);
    };
    dom.addEventListener(eventName, tempFn, false);
}

// 根据路径字符串获取组件中的响应式对象
export function getResponseDataByPath (vm, pathArr) {
    let len = pathArr.length;
    for (let i = 0; i < len; i++) {
        vm = vm[pathArr[i]];
    }
    return vm;
}

/**
 * @fnName setVerifyToResponseData 在有表达式传入的时候用来设置当前组件的响应式验证结果
 * @param vm 当前组件实例
 * @param _currentResponseVerify 响应式数据实例
 * @param statusObj 验证结果
 */
export function setVerifyToInstance (vm, vmVerify, verify) {
    Object.keys(verify).forEach(key => {
        let v = verify[key];
        if (vmVerify[key] !== v) {
            vmVerify[key] = v;
        }
    });
}

// dom 触发blur事件的方法
export const triggerBlur = el => {
    let e = document.createEvent("HTMLEvents");
    e.initEvent("blur", true, false);
    el.dispatchEvent(e);
};

export const verifyInit = (vm, inputDom, verifyNamespace) => {
    // 是否已在组件中绑定最终的验证结果，该结果为非响应式结果
    if (!vm.$verify) {
        vm.$verify = {
            doVerify (namespace = "default") { // 手动验证的方法
                if (namespace === "all") { // 如果验证所有
                    Object.keys(vm.$verify).forEach(key => {
                        if (key.endsWith("El")) {
                            vm.$verify[key].forEach(el => triggerBlur(el));
                        }
                    });
                } else {
                    // 默认是 default
                    vm.$verify[namespace + "El"].forEach(el => triggerBlur(el));
                }
            }
        };
    }
    // 设置非响应校验结果储存的地方
    if (!vm.$verify[verifyNamespace]) {
        vm.$verify[verifyNamespace] = [];
        vm.$verify[verifyNamespace].all = false; // 绑定集合校验结果
    }
    // 如果没有响应式集合就设置一个响应式集合
    if (!vm.$verify["res_" + verifyNamespace]) {
        vm.$verify["res_" + verifyNamespace] = [];
    }
    // 如果根组件实例的 $verify 上没有对应 el 数组则添加
    if (!vm.$verify[verifyNamespace + "El"]) {
        vm.$verify[verifyNamespace + "El"] = [];
    }
    // 每次初始化添加 inputDon 到自己的命名空间中的el数组
    vm.$verify[verifyNamespace + "El"].push(inputDom);
};
