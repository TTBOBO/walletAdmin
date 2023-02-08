<style scoped lang="stylus">
.verify-code-wrap {
    cursor: pointer;
    position: relative;
    top: 0;
    left: 0;
    user-select: none;
}

.verify-code-btn {
    text-decoration: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    font-size: 14px;
}

.verify-count-tip {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #EEEEEE;
    color: #666666;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    z-index: 1;
    font-size: 14px;
}

.verify-code-loading {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
}

.loading-btn {
    outline: none;
    border: none;
    font-size: 14px;
}
</style>

<template>
    <div class="verify-code-wrap">

        <!--  发送验证码按钮  -->
        <a href="javascript:;" class="verify-code-btn" v-show="verifyStatus === 'ready'" @click="sendVerify($event)">
            <slot name="text">发送验证码</slot>
        </a>

        <!--  倒计时面板  -->
        <div class="verify-count-tip" v-show="verifyStatus === 'counting'">
            <slot name="counttext" :count="innerCount">
                <span v-text="innerCount"></span>秒后重新发送
            </slot>
        </div>

        <!--  loading面板  -->
        <div class="verify-code-loading" v-show="verifyStatus === 'loading'">
            <slot name="loading">
                <button loading shape="circle" type="primary" class="loading-btn">发送中...</button>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "VerifyCode",
    data () {
        return {
            innerCount: 0,
            verifyStatus: "ready", // 验证码的三种状态，ready 准备态 loading 加载态 counting 进行态
            ownStyleDom: null,
            ownDataset: "data-v-" + Math.random().toString(36).slice(2) // 创建一个随机的 dataset 作为当前组件独特的作用域
        };
    },
    mounted () {
        // 递归设置作用域
        this.setScoped(this.$el);

        // 获取第一个 style dom元素
        let firstStyleDom = document.getElementsByTagName("style")[0];
        // 创建 style 标签用于添加动态样式
        this.ownStyleDom = document.createElement("style");
        this.modifyStyle();
        document.head.insertBefore(this.ownStyleDom, firstStyleDom);
    },
    beforeUnmount () {
        // 实例将要销毁之前释放当前组件不需要的变量
        this.ownStyleDom = null;
    },
    methods: {
        sendVerify ($event) {
            // 点击发送验证码之后立即进入 loading 态
            this.verifyStatus = "loading";
            // 给 event 对象绑定开始倒计时回调函数
            $event.startCount = this.startCount.bind(this);
            // 给 event 对象绑定倒计时失败回调函数
            $event.sendFail = this.sendFail.bind(this);
            // 发送验证码
            // this.$emit("click", $event);
        },
        reset () {
            this.verifyStatus = "ready";
        },
        sendFail () {
            // 发送失败，将状态改成ready
            this.verifyStatus = "ready";
        },
        startCount () {
            // 开始倒计时立即进入进行态
            this.verifyStatus = "counting";
            // 获取倒计时时间
            this.innerCount = this.count;
            // 倒计时逻辑
            let countFn = () => {
                if (this.innerCount > 0) {
                    --this.innerCount;
                    // 触发正在倒计时钩子
                    this.$emit("counting", this.innerCount);
                    setTimeout(countFn, 1000);
                } else {
                    // 倒计时结束，立即进入准备态
                    this.verifyStatus = "ready";
                    // 触发倒计时结束钩子
                    this.$emit("endCount", this.innerCount);
                }
            };
            setTimeout(countFn, 1000);
        },
        modifyStyle () {
            this.ownStyleDom.innerHTML = this.getStyleStr();
        },
        getStyleStr () {
            // 样式字符串
            let styleStr = `
        .verify-code-wrap[${this.ownDataset}]{
          width: ${this.w};
          height: ${this.h};
          border-radius: ${this.br};
          text-align: center;
          line-height: ${this.h};
        }
        .verify-code-btn[${this.ownDataset}]{
          color: ${this.c};
          text-decoration: none;
          background: ${this.bg};
          border-radius: ${this.br};
        }
        .verify-count-tip[${this.ownDataset}]{
          border-radius: ${this.br}
        }
        .verify-code-loading[${this.ownDataset}]{
          border-radius: ${this.br};
        }
        .loading-btn[${this.ownDataset}]{
          width: 100%;
          height: 100%;
          border-radius: ${this.br};
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
        }
        // 微调 发送中 的相对位置
        .loading-btn span[${this.ownDataset}]{
          position: relative;
          top: 1px;
        }
        `;
            return styleStr;
        },
        setScoped (dom) {
            dom.setAttribute(this.ownDataset, "");
            let childs = dom.children;
            for (let i = 0; i < childs.length; i++) {
                this.setScoped(childs[i]);
            }
        }
    },
    props: {
        w: {
            type: String,
            default: "160px"
        },
        h: {
            type: String,
            default: "40px"
        },
        bg: { // 设置背景色
            type: String,
            default: "#42B3FA"
        },
        c: {
            type: String, // 字体颜色
            default: "#fff"
        },
        br: { // 圆角
            type: String,
            default: "4px"
        },
        count: { // 计数时间
            type: [String, Number],
            default: 120
        },
        rebase: { // 外部传入用于重置验证码状态的属性，如果属性值为 true 验证码状态会被重置
            type: Boolean,
            default: false
        }
    },
    watch: {
        w () {
            this.modifyStyle();
        },
        h () {
            this.modifyStyle();
        },
        bg () {
            this.modifyStyle();
        },
        c () {
            this.modifyStyle();
        },
        br () {
            this.modifyStyle();
        },
        count () {
            this.modifyStyle();
        },
        rebase (v) {
            if (v) this.reset();
        }
    }
};
</script>
