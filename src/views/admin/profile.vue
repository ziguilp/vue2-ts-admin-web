<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :sm="24" :xs="24" :md="6">
        <el-card>
          <div slot="header">个人信息</div>
          <div>
            <el-form @submit.prevent="saveUserInfo">
              <el-row :gutter="10" class="avatar-con">
                <el-upload
                  class="avatar-con-wrap"
                  action=""
                  :auto-upload="false"
                  accept="image/png, image/jpeg"
                  :show-file-list="false"
                  :on-success="uploadSuccess"
                  :before-upload="uploadFile"
                >
                  <img
                    class="avatar-con-img"
                    v-if="userInfo.avatar"
                    :src="userInfo.avatar"
                  />
                  <svg-icon
                    v-else
                    class="avatar-default"
                    name="avatar"
                  ></svg-icon>
                </el-upload>
              </el-row>

              <el-form-item label="昵称">
                <el-input
                  v-model="userInfo.nickname"
                  disabled
                  placeholder="昵称"
                  style="margin-bottom: 30px"
                />
              </el-form-item>

              <el-form-item label="手机号">
                <el-input
                  v-model="userInfo.mobile"
                  disabled
                  placeholder="手机号"
                  style="margin-bottom: 30px"
                />
              </el-form-item>

              <el-form-item label="旧密码">
                <el-input
                  type="password"
                  v-model="userInfo.old_password"
                  placeholder="密码"
                  style="margin-bottom: 30px"
                />
              </el-form-item>

              <el-form-item label="密码">
                <el-input
                  type="password"
                  v-model="userInfo.password"
                  placeholder="密码"
                  style="margin-bottom: 30px"
                />
              </el-form-item>

              <el-form-item label="重复密码">
                <el-input
                  type="password"
                  v-model="userInfo.repassword"
                  placeholder="重复密码"
                  style="margin-bottom: 30px"
                />
              </el-form-item>

              <el-row :gutter="10">
                <el-button
                  :loading="loading"
                  type="primary"
                  style="width: 100%; margin-bottom: 30px"
                  @click.native.prevent="handleSave"
                  >保存</el-button
                >
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" :sm="24" :xs="24" :md="18">
        <el-card>
          <div slot="header">
            <h6>操作日志</h6>
          </div>
          <div class="logs">
            <custom-list :conf="opLogConf"></custom-list>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Tree as ElTree } from "element-ui";
import { TreeData } from "element-ui/types/tree";
import { IpageDataDto, UserInfoDto } from "@/api/types";
import { getOperateLog, getUserInfo, modifyPwd } from "@/api/users";
import { UserModule } from "@/store/modules/user";
import {
  CustomListColumnType,
  CustomListConf,
} from "@/components/custom-list/customType";

@Component({
  name: "UserProfile",
})
export default class extends Vue {
  private loading = false;
  private loadingTable = false;

  private userInfo = {
    userId: UserModule.userId,
    avatar: UserModule.avatar,
    roles: UserModule.roles,
    nickname: UserModule.name,
    mobile: UserModule.mobile,
    old_password: "",
    password: "",
    repassword: "",
  };

  private log = {
    list: [],
    total: 100,
    currentPage: 0,
    pageSize: 10,
  };

  created() {
      
  }

  private uploadSuccess(e: any) {
    console.log(e);
  }

  private uploadFile(e: any) {
    console.log(e);
  }

  private async handleSave() {
    console.log(this.userInfo);
    if (!this.userInfo.old_password) {
      return this.$message.error("请输入旧密码");
    }
    if (!this.userInfo.password) {
      return this.$message.error("请输入新密码");
    }
    if (this.userInfo.password === this.userInfo.old_password) {
      return this.$message.error("新旧密码不能一致");
    }
    if (!this.userInfo.repassword) {
      return this.$message.error("请确认新密码");
    }
    if (this.userInfo.password !== this.userInfo.repassword) {
      return this.$message.error("两次密码不一致");
    }
    if (this.userInfo.password.length < 6) {
      return this.$message.error("密码强度不足");
    }

    const res = await modifyPwd({
      oldPassword: this.userInfo.old_password,
      newPassword: this.userInfo.password,
    });

    if (res) {
      setTimeout(() => {
        UserModule.LogOut();
      }, 1000);
      return this.$message.success(`修改成功`);
    }

    return this.$message.error(`修改失败`);
  }

  private opLogConf: CustomListConf = {
    columns: [
      {
        type: CustomListColumnType.TEXT,
        prop: "id",
        label: "序号",
      },
      {
        type: CustomListColumnType.TEXT,
        prop: "path",
        label: "操作",
      },
      {
        type: CustomListColumnType.TEXT,
        prop: "ip",
        label: "IP",
      },
      {
        type: CustomListColumnType.DATE,
        prop: "date_created",
        label: "操作时间",
      },
    ],
    hideOperations: true,
    onLoadData: async (form: any, idata: IpageDataDto<any>) => {
      try {
          console.log(`onLoadData`, form, idata);
        const log = await getOperateLog({
          page: parseInt(String(idata.currentPage)),
          pageSize: idata.pageSize,
          user_id: UserModule.userId,
        });
        console.log({
            log
        })
        return log
      } catch (error) {
        console.error(error);
      }
    },
  };
}
</script>

<style lang="scss" scoped>
.avatar {
  &-default {
    fill: gray;
    font-size: 80px;
  }
  &-con {
    &-wrap {
      display: flex;
      justify-content: center;
    }
    &-img {
      height: 80px;
      width: 80px;
      border: 2px solid #fff;
      border-radius: 50%;
    }
  }
}
</style>
