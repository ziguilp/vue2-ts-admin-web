<template>
  <div>
    <custom-list :conf="config">
      <template slot="operations" scope="scope">
        <el-button type="text" size="small" @click="handleShowSkus(scope.row)">
          查看书籍
          <el-divider direction="vertical"></el-divider>
        </el-button>
        <el-popover placement="top" width="160" trigger="click">
          <p>是否立即打印？</p>
          <div style="text-align: right; margin: 0">
            <el-button
              type="primary"
              size="mini"
              @click="handlePrintLocate(scope.row)"
              >确定</el-button
            >
          </div>
          <el-button slot="reference" type="text" size="small"
            >打印库位签
            <!-- <el-divider direction="vertical"></el-divider> -->
          </el-button>
        </el-popover>
      </template>
    </custom-list>

    <el-dialog
      :title="activeLoc.located ? activeLoc.located.located : ''"
      v-loading="loadingGoods"
      :visible.sync="showGoods"
      close-on-click-modal
    >
      <el-table :data="activeLoc.goods">
        <el-table-column label="SKU" prop="sku_no"></el-table-column>
        <el-table-column label="名称" prop="goods_name"></el-table-column>
        <el-table-column label="图片" prop="goods_image">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.imaeg"
              style="height: 90px; width: 60px"
              :fit="'cover'"
              :preview-src-list="[scope.row.goods_image]"
              lazy
            ></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  CustomListColumnType,
  CustomListConf,
} from "@/components/custom-list/customType";
import { getSkuLocatesList, getGoodsOfLocate } from "@/api/sku";
import { printLocated } from "@/api/other";
import { IpageDataDto } from "@/api/types";
import { isLocation } from "@/utils/util";

@Component({
  name: "CateList",
  components: {},
})
export default class extends Vue {
  private loadingGoods: boolean = false;
  private showGoods: boolean = false;
  private activeLoc: any = {
    located: null,
    goods: [],
  };
  private config: CustomListConf = {
    columns: [
      {
        type: CustomListColumnType.TEXT,
        canSearch: false,
        canAdd: true,
        canEdit: false,
        showInTable: true,
        label: "库位",
        prop: "located",
        formRule: [
          { required: true },
          {
            validator: async (rule: any, val: any, callback: Function) => {
              if (!isLocation(val)) {
                callback(new Error("库位格式：LOC1_数字"));
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
        canSearch: false,
        canAdd: false,
        canEdit: false,
        showInTable: true,
        label: "书籍数量",
        prop: "count",
      },
    ],
    tableSelection: false,
    onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
      const data: any = await getSkuLocatesList();
      return data;
    },
    async onSave(form: any) {
      try {
        await printLocated(form.located);
        return true
      } catch (error) {
        throw error
      }
      return false
    },
  };

  private async handleShowSkus(row: any) {
    this.loadingGoods = true;
    this.showGoods = true;
    try {
      const { list: goods }: any = await getGoodsOfLocate(row.located);
      this.activeLoc = {
        located: row,
        goods,
      };
    } catch (error) {
      console.error(error);
    }

    this.loadingGoods = false;
  }

  private handlePrintLocate(row: any) {
    // console.log(row);
    printLocated(row.located);
  }
}
</script>
