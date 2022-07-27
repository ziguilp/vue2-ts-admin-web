<template>
    <div>
        <custom-list ref="list" :conf="config">
            <template slot="extbtns" scope="scope">
                <el-popover placement="top" width="160" trigger="click">
                    <p>是否立即打印？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button
                            type="primary"
                            size="mini"
                            @click="handlePrint(scope.row)"
                            >确定</el-button
                        >
                    </div>
                    <el-button slot="reference" type="text" size="small"
                        >打印标签
                        <!-- <el-divider direction="vertical"></el-divider> -->
                    </el-button>
                </el-popover>
            </template>
        </custom-list>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import {
    addSku,
    editSku,
    getSkuList,
    SkuStatusConf,
    SkuStatusDto,
    SkuType,
} from "@/api/sku";
import { printSku } from "@/api/other";
import { IpageDataDto } from "@/api/types";

@Component({
    name: "CateList",
    components: {},
})
export default class extends Vue {
    @Prop({
        type: Object,
    })
    private goodsInfo!: any;

    public refresh() {
        (this.$refs.list as any).refresh();
    }

    @Watch("goodsInfo", { deep: true })
    private goodsChange() {
        (this.$refs.list as any).refresh();
    }

    private async onLoadData(searchForm: any, idata: IpageDataDto<any>) {
        console.log("this.goodsInfo", this.goodsInfo);
        if (!this.goodsInfo) {
            console.log("this.goodsInfo", this.goodsInfo);
            throw new Error(`Undefined goodsInfo`);
        }
        const data: any = await getSkuList({
            goodsId: this.goodsInfo.id,
            page: parseInt(String(idata.currentPage)),
            pageSize: idata.pageSize,
        });
        return data;
    }

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
                canEdit: false,
                showInTable: true,
                label: "SKU编码",
                prop: "sku_no",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: false,
                label: "类型",
                prop: "goods_type",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: false,
                label: "物品/书籍ID",
                prop: "goods_id",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: true,
                showInTable: true,
                label: "库位",
                prop: "located",
            },
            {
                type: CustomListColumnType.NUMBER,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                min: 10,
                max: 100,
                precision: 0,
                showInTable: true,
                label: "成色",
                prop: "quality",
            },
            {
                type: CustomListColumnType.NUMBER,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                min: 1,
                max: 200,
                precision: 2,
                showInTable: true,
                label: "采购价",
                prop: "price",
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                showInTable: true,
                label: "状态",
                prop: "status",
                dataSource: {
                    value: SkuStatusConf,
                    key: "value",
                    labelKey: "label",
                },
            },
            {
                type: CustomListColumnType.TEXTAREA,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                showInTable: true,
                label: "备注",
                prop: "remark",
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
        onLoadData: this.onLoadData,
        onSave: async (form: any) => {
            form.goods_type = SkuType.BOOK;
            form.goods_id = this.goodsInfo.id;
            if (form.id) {
                const res = await editSku({
                    ...form,
                    price: parseInt(String(Number(form.price).mul(100))),
                });
                (this.$refs.list as any).refresh();
                return res;
            } else {
                const res = await addSku({
                    ...form,
                    num: 1,
                    price: parseInt(String(Number(form.price).mul(100))),
                });
                (this.$refs.list as any).refresh();
                return res;
            }
        },
    };

    private handlePrint(row: any) {
        printSku(row.sku_no);
    }
}
</script>
