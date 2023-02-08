<style lang="stylus" scoped>
.header-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: _headerBgColor;
    user-select: none;
    z-index: 2;
}

.header-con {
    min-width: _minContentWidth;
    max-width: _maxContentWidth;
    margin: 0 auto;
    height: _headerContentHeight;
    padding: 20px 30px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}

.logo-img {
    height: 60px;
}

.nav {
    display: flex;

}

.nav-link {
    display: block;
    font-size: 18px;
    color: #fff;
    margin-right: 40px;
    margin-top: 10px;
    position: relative;
    top: 0;
    left: 0;
}

.nav-active {
    color: _mainc;

    &:after {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        bottom: -10px;
        height: 2px;
        width: 30px;
        margin: auto;
        background: _mainc;
    }
}

.user-info {
    margin-left: auto;
    height: 80px;
    position: relative;
    top: 0;
    left: 0;
    white-space: nowrap;
    color: #fff;
    display: flex;
    align-items: center;

    &:hover .user-opera {
        display: block;
    }
}

.user-opera {
    display: none;
    width: 200px;
    height: 180px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 60px;
    right: -20px;
    flex-flow: row wrap;
    align-content: space-around;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    a {
        display: block;
        width: 100%;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        color: #333;
        padding-left: 30px;
        cursor: pointer;

        &:hover {
            background: #f8f8f8;
        }
    }
}

.user-info-name {
    height: 80px;
    padding: 20px;
    background: #E2F0FB;
    box-sizing: border-box;
    width: 100%;
    color: #333;

    h3 {
        font-size: 16px;
        font-weight: normal;
    }

    p {
        font-size: 14px;
    }
}

.input-item {
    display: flex;
    align-items: center;

    &:not(:last-child) {
        margin-bottom: 15px;
    }

    label {
        width: 140px;
        font-size: 16px;
        text-align: right;
    }

    .el-input {
        width: 360px;
    }
}

.err-tip {
    color: red;
    font-size: 12px;
    text-align: left;
    margin-bottom: 10px;
    width: 280px;
    margin-left: 116px;
}
</style>

<template>
    <div class="header-container">
        <div class="header-con">
            <img src="@/assets/logo.png" class="logo-img" alt="logo" @click="$router.push('/withdrawal-wallet-manage')">
            <div class="nav">
                <router-link to="/withdrawal-wallet-manage" class="nav-link" exact-active-class="nav-active">提币钱包管理
                </router-link>
                <router-link to="/withdraw-manage" class="nav-link" exact-active-class="nav-active">提币管理</router-link>
                <router-link to="/withdrawal-history" class="nav-link" exact-active-class="nav-active">提币历史记录
                </router-link>
                <router-link to="/finance-dump-list" class="nav-link" exact-active-class="nav-active">财务转储统计</router-link>
            </div>

            <div class="user-info">
                欢迎您，{{ username }} &emsp;
                <i class="iconfont iconxiangxia"></i>

                <div class="user-opera">
                    <div class="user-info-name">
                        <h3>用户名:</h3>
                        <p>{{ username }}</p>
                    </div>
                    <a href="javascript:;" style="margin-top: 10px;" @click="dialogVis= true">修改密码</a>
                    <a href="javascript:;" @click="loginOut">退出登录</a>
                </div>
            </div>
        </div>
    </div>

    <!--  修改密码弹窗  -->
    <el-dialog
        title="修改密码"
        v-model="dialogVis"
        :close-on-click-modal="false"
        width="30%">
        <div class="input-item">
            <label>旧密码：</label>
            <el-input size="medium"
                      v-model="ajaxParam.lastPassword"
                      show-password
                      need
                      placeholder="请输入旧密码"></el-input>
        </div>
        <div class="input-item">
            <label>新密码：</label>
            <el-input size="medium"
                      v-model="password"
                      show-password
                      need
                      placeholder="请输入新密码"
                      v-verify.equal.password="verify.password"></el-input>
        </div>
        <div class="err-tip" v-if="!verify.password.regExp">密码必须是6-18位的数字字母组合</div>
        <div class="input-item">
            <label>确认新密码：</label>
            <el-input size="medium"
                      v-model="ajaxParam.newPassword"
                      show-password
                      need
                      placeholder="请确认新密码"
                      v-verify.equal.password="verify.confirm"></el-input>
        </div>
        <template v-if="!verify.confirm.isFirst">
            <div class="err-tip" v-if="!verify.confirm.equal">两次密码输入不一致</div>
        </template>

        <template #footer>
            <span class="dialog-footer">
              <el-button size="small" @click="dialogVis = false">取 消</el-button>
              <el-button size="small" type="primary" @click="changePassword"
                         :loading="confirmBtnLoading">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { ajaxTry, msg } from "@/util";
import { defineComponent } from "vue";

export default defineComponent({
    name: "Header",
    data () {
        return {
            confirmBtnLoading: false,
            verify: {
                confirm: { equal: true },
                password: { regExp: true }
            },
            username: "",
            dialogVis: false,
            password: "",
            ajaxParam: {
                lastPassword: "", // 旧密码
                newPassword: "" // 新密码
            }

        };
    },
    mounted () {
        // 获取本地的 username
        this.username = localStorage.getItem("username") || "神秘用户";
    },
    methods: {
        async changePassword () {
            // 修改密码
            this.$verify.doVerify();
            if (!this.$verify.default.all) {
                this.$message("请正确填写表单", "验证失败");
                return;
            }
            this.confirmBtnLoading = true;
            let [f, r] = await ajaxTry(
                this.axios({
                    ...this.api.changePassword,
                    data: this.ajaxParam
                })
            );
            this.confirmBtnLoading = false;
            msg([f, r]);
            if (f) {
                this.dialogVis = false;
            }

        },
        async loginOut () {
            // 退出登录
            let [f, r] = await ajaxTry(
                this.axios({
                    ...this.api.logOut
                })
            );
            await msg([f, r]);
            if (f) {
                this.$router.push("/");
            }
        }
    }
});
</script>
