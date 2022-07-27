<template>
  <div>
    <custom-list :conf="config">
      <template slot="mobile" scope="scope">
        {{ scope.row.mobile }}
      </template>
    </custom-list>
  </div>
</template>

<script lang="ts">
import { createAdmin, getOperateLog, getAdminList } from "@/api/users";
import { UserModule } from "@/store/modules/user";
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  CustomListColumnType,
  CustomListConf,
} from "@/components/custom-list/customType";
import { getRoleList } from "@/api/role";
import { isMobile } from "@/utils/validate";
import { IpageDataDto } from "@/api/types";

@Component({
  name: "AdminList",
  components: {},
})
export default class extends Vue {
  private config: CustomListConf = {
    columns: [
      {
        type: CustomListColumnType.TEXT,
        canSearch: false,
        canAdd: false,
        canEdit: false,
        showInTable: true,
        label: "角色",
        prop: "role_name",
      },
      {
        type: CustomListColumnType.SELECT,
        showInTable: false,
        canSearch: true,
        canAdd: true,
        canEdit: false,
        prop: "role_id",
        label: "角色",
        dataSource: {
          value: async () => {
            return (await getRoleList()).list;
          },
          key: "id",
          labelKey: "name",
        },
        formRule: [
          {
            validator: async (rule: any, val: any, callback: Function) => {
              if (!val) {
                callback(new Error("请选择角色"));
              } else {
                callback();
              }
            },
            trigger: ["blur", "change"],
          },
        ],
      },
      {
        type: CustomListColumnType.TEXT,
        label: "昵称",
        canSearch: true,
        canAdd: true,
        canEdit: true,
        prop: "nickname",
        formRule: [
          {
            required: true,
            message: "请填写昵称",
            trigger: ["blur", "change"],
          },
        ],
      },
      {
        type: CustomListColumnType.IMAGE,
        label: "头像",
        canSearch: false,
        canAdd: true,
        canEdit: true,
        prop: "avatar",
        height: "60px",
        width: "60px",
        formRule: [],
      },
      {
        type: CustomListColumnType.TEXT,
        canSearch: true,
        canAdd: true,
        canEdit: true,
        label: "手机号",
        prop: "mobile",
        formRule: [
          {
            validator: (rule: any, val: any, callback: Function) => {
              if (!val) {
                callback(new Error("请输入手机号"));
              } else {
                if (!isMobile(val)) {
                  return callback(new Error("手机号无效"));
                }
                callback();
              }
            },
            message: "请填写手机号",
            trigger: "blur",
          },
        ],
      },
      {
        type: CustomListColumnType.SELECT,
        label: "状态",
        canSearch: true,
        canAdd: true,
        canEdit: true,
        prop: "status",
        dataSource: {
          key: "value",
          value: [
            {
              label: "禁用",
              value: "locked",
            },
            {
              label: "正常",
              value: "normal",
            },
          ],
        },
      },
      {
        type: CustomListColumnType.PASSWORD,
        label: "密码",
        prop: "password",
        showInTable: false,
        canSearch: false,
        canAdd: true,
        canEdit: false,
        formRule: [
          {
            required: true,
            type: "string",
            min: 6,
            message: "请输入有效的密码",
            trigger: ["blur", "change"],
          },
        ],
      },
      {
        type: CustomListColumnType.PASSWORD,
        label: "确认密码",
        prop: "repassword",
        showInTable: false,
        canSearch: false,
        canAdd: true,
        canEdit: false,
        formRule: (val: string, formVal: any) => {
          if (!val) {
            throw new Error("请确认密码");
          } else {
            if (val !== formVal.password) {
              throw new Error("两次密码不一致");
            }
          }
        },
      },
      {
        type: CustomListColumnType.TEXT_ARRAY,
        prop: "test",
        label: "数组测试",
        canAdd: true,
        canEdit: true,
      },
    ],
    tableSelection: true,
    onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
      const data: any = await getAdminList({
        keyword: searchForm.mobile || "",
        page: parseInt(String(idata.currentPage)),
        pageSize: idata.pageSize,
      });
       data.list.map((d:any) => {
          d.ctest = []
          return d
      });
      return data
    },
    async onSave(form: any) {
      if (form.id) {
      } else {
        const res = await createAdmin(form);
        return res;
      }
    },
  };
}
</script>
