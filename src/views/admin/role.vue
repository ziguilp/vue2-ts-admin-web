<template>
  <div>
    <custom-list :conf="conf" ref="slt">
      <template slot="tools">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="refresh"
        ></el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
          >新增</el-button>
      </template>
      <template slot="rights" scope="scope">
        <el-popover
          placement="top-start"
          title="权限"
          width="300"
          trigger="click"
          :content="rightsContent(scope.row)"
        >
          <el-button slot="reference" type="primary" plain size="small"
            >点击查看</el-button
          >
        </el-popover>
      </template>

      <template slot="operations" scope="scope">
        <el-button-group v-if="!$permission.isSuperAdmin(scope.row.rights)">
          <el-button type="text" size="small" @click="handleEdit(scope.row)"
            >修改
          </el-button>
        </el-button-group>
        <el-button-group v-else> </el-button-group>
      </template>
    </custom-list>
    <role-edit-vue ref="editForm" @refresh="refresh"></role-edit-vue>
  </div>
</template>

<script lang="ts">
import roleEditVue from "./components/roleEdit.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import { getRoleList } from "@/api/role";
import moment from "moment";
import { IpageDataDto, RoleDto } from "@/api/types";
import { UserModule } from "@/store/modules/user";
import {
  CustomListColumnType,
  CustomListConf,
} from "@/components/custom-list/customType";
import CustomList from "@/components/custom-list/list.vue";

@Component({
  name: "RoleList",
  components: {
    roleEditVue,
  },
})
export default class extends Vue {

  private conf: CustomListConf = {
    columns: [
      {
        type: CustomListColumnType.TEXT,
        showInTable: true,
        canSearch: false,
        canEdit: false,
        canAdd: false,
        label: "ID",
        prop: "id",
        width: "50px",
      },
      {
        type: CustomListColumnType.TEXT,
        label: "角色名称",
        canAdd: true,
        canEdit: true,
        prop: "name",
        canSearch: true,
        formRule: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: "blur",
          },
        ],
      },
      {
        type: CustomListColumnType.TEXT,
        showInTable: true,
        canSearch: false,
        canAdd: true,
        canEdit: true,
        label: "说明",
        prop: "explain",
        formRule: [
          {
            required: true,
            message: "请填写角色说明",
            trigger: "blur",
          },
        ],
      },
      {
        type: CustomListColumnType.DATE,
        showInTable: true,
        canSearch: false,
        canAdd: false,
        canEdit: false,
        label: "添加时间",
        prop: "date_created",
      },
      {
        type: CustomListColumnType.DATE,
        showInTable: true,
        canSearch: false,
        canAdd: false,
        canEdit: false,
        label: "权限",
        prop: "rights",
      },
    ],
    onLoadData: async (form: any, idata: IpageDataDto<any>) => {
      return await getRoleList();
    },
    onSave: async (form: any) => {},
  };

  private refresh(v: Date) {
    setTimeout(() => {
        (this.$refs.slt as CustomList).refresh()
    })
  }

  private handleAdd() {
    (this.$refs.editForm as roleEditVue).init({ readonly: false });
  }

  private handleEdit(row: RoleDto) {
    (this.$refs.editForm as roleEditVue).init({ form: row, readonly: false });
  }

  private rightsContent(row: RoleDto) {
    if (row.rights.indexOf("*") > -1) return "超级权限：权限不受限";

    return (row.rights || [])
      .map((k: string) => {
        return UserModule.permissionObj[k];
      })
      .join("、");
  }
}
</script>
