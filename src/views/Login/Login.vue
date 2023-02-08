<style lang="stylus" scoped>
.login {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #fff;
}

.login-container {
    min-width: 1280px;
    height: 100%;
    background: url("../../assets/login-bg.png") left / cover scroll;
    position: relative;
    top: 0;
    left: 0;
}

.login-con {
    width: 360px
    height: 300px
    position: absolute;
    top: 0;
    bottom: 100px;
    right: 6%;
    margin: auto;
}

.login-con-title {
    font-size: 26px;
    color: #333;
    margin-bottom: 5px;
}

.login-con-subtitle {
    font-size: 16px;
    color: #333;
    margin-bottom: 30px;
}

.input-box {
    border-bottom: 1px solid #979797;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.input-box-icon {
    margin: 0 8px;
    font-size: 20px;
}

:deep() .input-box-input {
    font-size: 16px;
    width: 300px
    outline: none;
    border: none;
    padding: 0 8px;

    input {
        border: none;
        height: 50px;
        line-height: @height;
    }
}

// 验证码样式复写
.verify-code-loading-text {
    font-size: 16px;
    color: _mainc;
}

.verify-code-loading-div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.remember-user-name {
    margin-top: 30px;
}

.verify-code-input {
    width: 247px;
    padding-left: 53px;
    box-sizing: border-box;
}
</style>
<template>
    <div class="login">
        <div class="login-container">

            <div class="login-con">
                <div class="login-con-title">管理员登录</div>
                <div class="login-con-subtitle">Administrator login</div>
                <div class="input-box">
                    <i class="el-icon-user input-box-icon"></i>
                    <el-input type="text" class="input-box-input" v-model="username" placeholder="用户名"></el-input>
                </div>
                <div class="input-box">
                    <i class="el-icon-lock input-box-icon"></i>
                    <el-input type="password" @keyup.enter="f_login" class="input-box-input" v-model="password"
                              show-password
                              placeholder="密码"></el-input>
                </div>
                <div class="input-box">
                    <i class="el-icon-phone-outline input-box-icon"></i>
                    <el-input type="text" class="input-box-input" v-model="phone" placeholder="手机号或邮箱" autocomplete="off"></el-input>
                </div>
                <div class="input-box">
                    <el-input type="text" class="input-box-input" v-model="code" placeholder="验证码" autocomplete="off"></el-input>
                    <VerifyCode bg="#2C9EF8" h="36px" @click="sendVerify"></VerifyCode>
                </div>
                <el-checkbox v-model="checkRemember" class="remember-user-name">记住用户名和密码</el-checkbox>
                <div style="margin-top: 30px;">
                    <el-button :loading="btnLoading" style="width: 100%;" type="primary" round @click="f_login">
                        立即登录
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// import { encrypt, decrypt } from "@/util/cryptUtil";
import { defineComponent } from "vue";
import useLogin from "./useLogin";
import VerifyCode from "@/components/VerifyCode.vue";
// 父组件引入子组件的正确写法:

export default defineComponent({
    name: "login",
    setup () {
        return {
            ...useLogin()
        };
    },
    components: {
        VerifyCode
    }
});
</script>
