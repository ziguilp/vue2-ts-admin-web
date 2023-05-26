<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-05-26 12:11:25
 * @FilePath      : /nls-admin/src/layout/components/Sidebar/SidebarLogo.vue
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<template>
    <div class="sidebar-logo-container" :class="{ collapse: collapse }">
        <transition name="sidebarLogoFade">
            <router-link
                v-if="collapse"
                key="collapse"
                class="sidebar-logo-link"
                to="/"
            >
                <svg-icon
                    name="logo"
                    class="sidebar-logo"
                    :original="true"
                    style="height: 32px; width: 32px; fill: #fff"
                ></svg-icon>
            </router-link>
            <router-link v-else key="expand" class="sidebar-logo-link" to="/">
                <!-- <img
          src="favicon.ico"
          class="sidebar-logo"
        > -->
                <svg-icon
                    name="logo"
                    class="sidebar-logo"
                    :original="true"
                    style="height: 32px; width: 32px; fill: #fff"
                ></svg-icon>

                <h1 class="sidebar-title">
                    {{ title }}
                </h1>
            </router-link>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import settings from "@/settings";

@Component({
    name: "SidebarLogo",
})
export default class extends Vue {
    @Prop({ required: true }) private collapse!: boolean;

    private title = settings.title;
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #2b2f3a;
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
        height: 100%;
        width: 100%;

        & .sidebar-logo {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 12px;
        }

        & .sidebar-title {
            display: inline-block;
            margin: 0;
            color: #fff;
            font-weight: 600;
            line-height: 50px;
            font-size: 14px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0px;
        }
    }
}
</style>
