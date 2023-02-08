import {
    bindEventFirstAndLater,
    setVerifyToInstance,
    verifyInit
} from "./util/verifyUtil";

export default function (el, binding, app, options) {
    // 定义真实 input 或者 textarea dom
    let inputDom = null;
    // 判断el 是否是input或者 textarea 如果不是找后代第一个 input 或 textarea
    let tagName = el.nodeName.toLowerCase();
    if (tagName === "input" || tagName === "textarea") {
        inputDom = el;
    } else {
        inputDom = el.getElementsByTagName("input")[0] || el.getElementsByTagName("textarea")[0];
    }

    // 记录原本的样式
    let originBorderStyle = getComputedStyle(inputDom).border;

    /**
     * arg 指令参数 :参数 用于作用域设定
     * modifiers 指令修饰符，用于指定指令的校验正则
     * vmVerify 组件内部响应式验证结果
     * */
    let {
        instance,
        arg,
        modifiers,
        value: vmVerify
    } = binding;

    // 根据是否传入 arg 来创建命名空间
    let namespace = arg || "default";

    // 验证初始化包括初始化存放验证结果的对象和添加inputDom到队列
    verifyInit(instance, inputDom, namespace);

    // 定义供内部使用的存放验证结果的数组（非响应），这个是当前命名空间下的
    let verifyArr = instance.$verify[namespace];
    let vmVerifyArr = instance.$verify["res_" + namespace];

    // 获取当前结果储存位置
    let index = verifyArr.length;

    // 将修饰符对象切割成数组用于正则验证
    let regExpArr = Object.keys(modifiers);
    // 判断数组中是否有 equal 修饰符，用于判断输入框内容是否相等 如果有则从数组中删除并且将 hasEqual 设置为true 没有则将其设置 false
    let equalIndex = regExpArr.indexOf("equal");
    let _hasEqual = equalIndex === -1 ? false : (regExpArr.splice(equalIndex, 1), true);

    // 储存当前非响应式结果
    let currVerify = verifyArr[index] = {
        all: true, // 保存整体验证的结果
        regExp: true, // 保存正则验证的结果
        equal: true, // 保存相等验证的结果
        empty: true, // 保存空验证的结果,这里默认设置为 true 是因为通常用到这个状态的输入框，第一次加载不会让这个状态对应的提示信息显示出来
        isFirst: true, // 是否是第一次执行验证
        value: "", // 默认input 值为空字符串
        _hasEqual, // 当前是否包含 equal 修饰符
        _skip: inputDom.getAttribute("skip") === "" || inputDom.getAttribute("skip") === "true", // 是否跳过当前项的验证结果
        _need: inputDom.getAttribute("need") === "" || inputDom.getAttribute("need") === "true"// 是否是必填项
    };

    // 如果有传入表达式，则首次设置响应式验证结果的初始化值,顺便把所有的响应式结果存到外面方便统一操作
    if (vmVerify) {
        setVerifyToInstance(instance, vmVerify, currVerify);
        vmVerifyArr.push(vmVerify);
    }

    // 实际检测内容是否合法的函数
    function verifyInputHandle () {

        // 更新 skip 和 need
        currVerify._skip = inputDom.getAttribute("skip") === "" || inputDom.getAttribute("skip") === "true";
        currVerify._need = inputDom.getAttribute("need") === "" || inputDom.getAttribute("need") === "true";
        if (vmVerify) setVerifyToInstance(instance, vmVerify, currVerify);

        // 立刻获取元素中的 value
        let inputValue = inputDom.value;
        // 输入框空验证
        let emptyVerify = true;
        // 验证规则，获取最终正则验证的结果，此时还没有检验 equal 验证
        let regVerify = true;

        if (inputValue.trim() === "") {
            emptyVerify = false;
            regVerify = true;
        } else {
            emptyVerify = true;
            regVerify = regExpArr.some(key => options.regExp[key].test(inputValue));
        }
        // 优先更新非响应式数据
        currVerify.isFirst = false; // 更新非响应数据中的 isFirst

        currVerify.value = inputValue; // 更新非响应数据中的 value

        currVerify.regExp = regVerify; // 更新非响应数据中的正则验证状态

        currVerify.empty = emptyVerify; // 更新非响应数据中的空验证
        if (vmVerify) {
            setVerifyToInstance(instance, vmVerify, currVerify);
        }

        // 验证相等性 equal, 这个验证失败需要更新所有具备_hasEqual的数据源
        let equalVerify = true;
        if (_hasEqual) {
            // 获取所有的包含equal属性的 value 然后将其放入数组做相等性对比
            let equalItems = verifyArr.filter(item => item._hasEqual); // 所有的具备equal的验证
            let valueArr = equalItems.map(i => i.value);
            if (valueArr.length > 0) {
                let tempV = valueArr[0];
                // 判断相等性
                equalVerify = valueArr.every(v => v === tempV);
            }
            // 只要有一个相等性验证不通过，所有的相等性验证都要同步更新
            equalItems.forEach(i => (i.equal = equalVerify));
            // 在所有的响应式验证数据中设置相等性验证结果
            let resEqualItems = vmVerifyArr.filter(i => i._hasEqual);
            resEqualItems.forEach(i => (i.equal = equalVerify));

            equalItems.forEach(item => {
                item.all = (v => {
                    if (v._need) {
                        return v.empty && v.regExp && v.equal;
                    } else {
                        return v.regExp && v.equal;
                    }
                })(item);
            });

            // 由于具备相等性验证所以要聚合计算所有的相等性验证
            resEqualItems.forEach(item => {
                item.all = (v => {
                    if (v._need) {
                        return v.empty && v.regExp && v.equal;
                    } else {
                        return v.regExp && v.equal;
                    }
                })(item);
            });

        } else {
            // 自己不具备相等性验证就只更新自己即可
            currVerify.all = (c => {
                if (c._need) {
                    return c.empty && c.regExp;
                } else {
                    return c.regExp;
                }
            })(currVerify);
            if (vmVerify) vmVerify.all = currVerify.all;

        }
        // debugger
        // console.log(vm.$verify)
        // 聚合计算所有的结果生成最终的结果
        verifyArr.all = verifyArr.every(obj => {
            if (obj._skip) { // 如果设置了跳过
                return true;
            } else {
                return obj.all;
            }
        });

        // 空input 非必选时不显示红 必选时显示红
        // 正则验证失败一定为红 相等性验证失败的最后一个框
        let isLastEqualInput = false; // 判断当前输入框是否为最后一个相等性输入框
        let lastEqualInputIndex = -1;
        for (let i = verifyArr.length - 1; i >= 0; i--) {
            if (verifyArr[i]._hasEqual) {
                lastEqualInputIndex = i;
                break;
            }
        }
        if (lastEqualInputIndex === index) {
            isLastEqualInput = true;
        } else {
            isLastEqualInput = false;
        }
        if (options.defaultStyle) {
            // if ((currVerify.empty && !currVerify._need) || currVerify._skip || (regVerify && equalVerify) || (regVerify && !equalVerify && !isLastEqualInput)) {
            //     el.style.border = originBorderStyle;
            // } else {
            //     el.style.border = "2px solid #ed4014";
            // }
            if (currVerify._skip) {
                inputDom.style.border = originBorderStyle;
            } else {
                if (
                    (!emptyVerify && currVerify._need) ||
                    (!equalVerify && isLastEqualInput) ||
                    !regVerify
                ) {
                    inputDom.style.border = "2px solid #ed4014";
                } else {
                    inputDom.style.border = originBorderStyle;
                }
            }

        }

    }

    let firstFn = function () {
        verifyInputHandle();
        inputDom.addEventListener("input", function () {
            verifyInputHandle();
        }, false);
    };
    let laterFn = function () {
        verifyInputHandle();
    };
    bindEventFirstAndLater(inputDom, "blur", firstFn, laterFn);
}
