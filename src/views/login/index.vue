<template>
    <div class="login-container">
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
        >
            <div class="title-container">
                <h3 class="title">{{ settings.title }}</h3>
            </div>

            <el-form-item prop="roleId">
                <span class="svg-container">
                    <!-- <svg-icon name="cpu" /> -->
                    <i class="el-icon-cpu"></i>
                </span>

                <el-select
                    v-model="loginForm.roleId"
                    placeholder="请选择登录角色"
                >
                    <el-option
                        v-for="item in roles"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop="username">
                <span class="svg-container">
                    <svg-icon name="user" />
                </span>
                <el-input
                    ref="username"
                    v-model="loginForm.username"
                    name="username"
                    type="text"
                    autocomplete="on"
                    placeholder="用户名"
                />
            </el-form-item>

            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon name="password" />
                </span>
                <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    autocomplete="on"
                    @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon
                        :name="
                            passwordType === 'password' ? 'eye-off' : 'eye-on'
                        "
                    />
                </span>
            </el-form-item>

            <el-button
                :loading="loading"
                type="primary"
                style="width: 100%; margin-bottom: 30px"
                @click.native.prevent="handleLogin"
                >登录</el-button
            >
        </el-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { Dictionary } from "vue-router/types/router";
import { Form as ElForm, Input } from "element-ui";
import { UserModule } from "@/store/modules/user";
import { isValidUsername } from "@/utils/validate";
import settings from "@/settings";

@Component({
    name: "Login",
})
export default class extends Vue {
    private settings = settings;
    private roles = [
        { label: "管理员", value: 1 },
        { label: "商户", value: 3 },
    ];
    private validateUsername = (
        rule: any,
        value: string,
        callback: Function
    ) => {
        if (!isValidUsername(value)) {
            callback(new Error("请输入正确的用户名"));
        } else {
            callback();
        }
    };
    private validatePassword = (
        rule: any,
        value: string,
        callback: Function
    ) => {
        if (value.length < 6) {
            callback(new Error("密码至少6位"));
        } else {
            callback();
        }
    };

    private loginForm = {
        roleId: 1,
        username: "",
        password: "",
    };

    private loginRules = {
        username: [{ validator: this.validateUsername, trigger: "blur" }],
        password: [{ validator: this.validatePassword, trigger: "blur" }],
    };

    private passwordType = "password";
    private loading = false;
    private showDialog = false;
    private redirect?: string;
    private otherQuery: Dictionary<string> = {};

    @Watch("$route", { immediate: true })
    private onRouteChange(route: Route) {
        // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
        // See https://github.com/vuejs/vue-router/pull/2050 for details
        const query = route.query as Dictionary<string>;
        if (query) {
            this.redirect = query.redirect;
            this.otherQuery = this.getOtherQuery(query);
        }
    }

    mounted() {
        if (this.loginForm.username === "") {
            (this.$refs.username as Input).focus();
        } else if (this.loginForm.password === "") {
            (this.$refs.password as Input).focus();
        }
    }

    private showPwd() {
        if (this.passwordType === "password") {
            this.passwordType = "";
        } else {
            this.passwordType = "password";
        }
        this.$nextTick(() => {
            (this.$refs.password as Input).focus();
        });
    }

    private handleLogin() {
        (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
            if (valid) {
                this.loading = true;
                const loginRes = await UserModule.Login(this.loginForm).catch(
                    () => {
                        this.loading = false;
                    }
                );
                if (!loginRes) {
                    return;
                }
                this.$router.push({
                    path: this.redirect || "/",
                    query: this.otherQuery,
                });
                UserModule.GetPermission({ refresh: true });
                // Just to simulate the time of the request
                setTimeout(() => {
                    this.loading = false;
                }, 0.5 * 1000);
            } else {
                return false;
            }
        });
    }

    private getOtherQuery(query: Dictionary<string>) {
        return Object.keys(query).reduce((acc, cur) => {
            if (cur !== "redirect") {
                acc[cur] = query[cur];
            }
            return acc;
        }, {} as Dictionary<string>);
    }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
    .login-container .el-input {
        input {
            color: $loginCursorColor;
        }
        input::first-line {
            color: $lightGray;
        }
    }
}

.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            height: 47px;
            background: transparent;
            border: 0px;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $lightGray;
            caret-color: $loginCursorColor;
            -webkit-appearance: none;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $loginBg inset !important;
                -webkit-text-fill-color: #fff !important;
            }
        }
    }

    .el-select {
        width: 100%;
        position: absolute;
        .el-input {
            width: 100%;
        }
        &__caret {
            margin-left: -92px;
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
.login-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: $loginBg;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $darkGray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $lightGray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $darkGray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
