<template>
  <div>
    <custom-list :conf="config"> </custom-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  CustomListColumnType,
  CustomListConf,
} from "@/components/custom-list/customType";
import { addCate, CategoryType, getCateList } from "@/api/cate";
import { IpageDataDto } from "@/api/types";

@Component({
  name: "CateList",
  components: {},
})
export default class extends Vue {
  private config: CustomListConf = {
    columns: [
      {
        type: CustomListColumnType.NUMBER,
        canSearch: false,
        canAdd: false,
        canEdit: false,
        showInTable: true,
        label: "序号",
        prop: "id",
      },
      {
        type: CustomListColumnType.TEXT,
        canSearch: false,
        canAdd: true,
        canEdit: true,
        showInTable: true,
        label: "分类名称",
        prop: "name",
      },
      {
        type: CustomListColumnType.TEXT,
        canSearch: false,
        canAdd: false,
        canEdit: false,
        showInTable: true,
        label: "分类模型",
        prop: "model_type",
        dataSource: {
          key: "value",
          labelKey: "label",
          value: [
            {
              label: "书籍",
              value: CategoryType.BOOK,
            },
          ],
        },
      },
      {
        type: CustomListColumnType.DATE,
        canSearch: false,
        canAdd: false,
        canEdit: false,
        showInTable: true,
        label: "添加时间",
        prop: "date_created",
      },
    ],
    tableSelection: false,
    onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
      const data: any = await getCateList({
        page: parseInt(String(idata.currentPage)),
        pageSize: idata.pageSize,
      });
      return data;
    },
    async onSave(form: any) {
      form.model_type = CategoryType.BOOK;
      if (form.id) {
      } else {
        const res = await addCate(form);
        return res;
      }
    },
  };
}
</script>
