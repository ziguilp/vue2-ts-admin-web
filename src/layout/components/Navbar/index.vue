<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-02 16:51:11
 * @FilePath      : /nls-admin/src/layout/components/Navbar/index.vue
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<template>
    <div class="navbar">
        <hamburger
            id="hamburger-container"
            :is-active="sidebar.opened"
            class="hamburger-container"
            @toggle-click="toggleSideBar"
        />
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <div class="right-menu">
            <el-dropdown
                class="avatar-container right-menu-item hover-effect"
                trigger="click"
            >
                <div class="avatar-wrapper">
                    <img
                        :src="avatar + '?imageView2/1/w/80/h/80'"
                        class="user-avatar"
                    />
                    <a>{{ nickname }}</a>
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <a
                        v-if="
                            $permission.isSuperAdmin() ||
                            $permission.can('refreshRights')
                        "
                        @click="refreshRights"
                    >
                        <el-dropdown-item>
                            <span>接口权限配置刷新</span>
                        </el-dropdown-item>
                    </a>

                    <router-link to="/">
                        <el-dropdown-item> 首页 </el-dropdown-item>
                    </router-link>
                    <router-link to="/admin/profile">
                        <el-dropdown-item> 个人信息 </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided>
                        <span style="display: block" @click="logout">退出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@/store/modules/app";
import { UserModule } from "@/store/modules/user";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import { refreshAuthRightsConf } from "@/api/role";

@Component({
    name: "Navbar",
    components: {
        Breadcrumb,
        Hamburger,
    },
})
export default class extends Vue {
    get sidebar() {
        return AppModule.sidebar;
    }

    get device() {
        return AppModule.device.toString();
    }

    get avatar() {
        return UserModule.avatar;
    }

    get nickname() {
        return UserModule.name;
    }

    private toggleSideBar() {
        AppModule.ToggleSideBar(false);
    }

    private async logout() {
        await UserModule.LogOut();
        this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }

    private async refreshRights() {
        try {
            const l = this.$loading({
                text: "处理中",
            });
            await refreshAuthRightsConf();
            l.close();
        } catch (error) {
            console.error(error);
        }
        console.log("refreshRights");
    }

    mounted() {
        console.log(this.$permission.can("refresh_auth_conf"));
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        padding: 0 15px;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    margin-right: 6px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 20px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
