<template>
    <div>
        <custom-list ref="booklist" :conf="config">
            <template slot="extbtns" scope="scope">
                <el-button
                    type="text"
                    size="small"
                    @click="handleCreateSku(scope.row)"
                    >新增SKU
                    <el-divider direction="vertical"></el-divider>
                </el-button>
                <el-button
                    type="text"
                    size="small"
                    @click="handleShowSkus(scope.row)"
                    >SKU列表
                    <!-- <el-divider direction="vertical"></el-divider> -->
                </el-button>
            </template>
            <template slot="category_id" scope="scope">
                {{ parseCate(scope.row.categorys) }}
            </template>
        </custom-list>

        <el-dialog
            :title="`《${activeBook ? activeBook.name : ''}》 SKU`"
            ref="popsku"
            :visible.sync="showSkuList"
            width="800px"
            placement="center"
        >
            <SkuListVue ref="skulist" :goodsInfo="activeBook"></SkuListVue>
        </el-dialog>

        <EditForm ref="skuform" :conf="skuConfig"></EditForm>
    </div>
</template>

<script lang="ts">
import { UserModule } from "@/store/modules/user";
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import { addBook, BookItem, editBook, getBookList } from "@/api/book";
import { getCateList } from "@/api/cate";
import { getRoleList } from "@/api/role";
import { isMobile } from "@/utils/validate";
import { IpageDataDto } from "@/api/types";
import SkuListVue from "./components/skulist.vue";
import EditForm from "@/components/custom-list/editForm.vue";

import { addSku, editSku, SkuItem, SkuType } from "@/api/sku";
import { nextTick } from "process";

@Component({
    name: "BookList",
    components: {
        SkuListVue,
        EditForm,
    },
})
export default class extends Vue {
    private activeBook!: BookItem;
    private showSkuList: boolean = false;
    private config: CustomListConf = {
        columns: [
            {
                type: CustomListColumnType.TEXT,
                canSearch: true,
                canAdd: false,
                canEdit: false,
                showInTable: false,
                label: "检索词",
                placeholder: "输入ISBN/书籍名称/作者",
                prop: "keyword",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: true,
                canEdit: false,
                showInTable: true,
                label: "ISBN",
                prop: "isbn",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "书籍名称",
                canSearch: false,
                canAdd: true,
                canEdit: true,
                prop: "name",
            },
            {
                type: CustomListColumnType.IMAGE,
                label: "封面",
                canSearch: false,
                canAdd: true,
                canEdit: true,
                prop: "image",
                height: "80px",
                width: "60px",
                formRule: [],
            },
            {
                type: CustomListColumnType.SELECT,
                label: "状态",
                canSearch: true,
                canAdd: true,
                canEdit: true,
                prop: "status",
                dataSource: {
                    value: [
                        {
                            label: "显示",
                            value: 0,
                        },
                        {
                            label: "下架",
                            value: 1,
                        },
                    ],
                    key: "value",
                    labelKey: "label",
                },
            },
            {
                type: CustomListColumnType.SELECT,
                showInTable: true,
                canSearch: true,
                canAdd: false,
                canEdit: false,
                prop: "category_id",
                label: "分类",
                multiple: false,
                dataSource: {
                    value: async () => {
                        return (
                            await getCateList({
                                page: 1,
                                pageSize: 100,
                            })
                        ).list;
                    },
                    key: "id",
                    labelKey: "name",
                },
                formRule: [],
            },
            {
                type: CustomListColumnType.SELECT,
                showInTable: false,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                prop: "category_ids",
                label: "分类",
                multiple: true,
                dataSource: {
                    value: async () => {
                        return (
                            await getCateList({
                                page: 1,
                                pageSize: 100,
                            })
                        ).list;
                    },
                    key: "id",
                    labelKey: "name",
                },
                formRule: [
                    {
                        validator: async (
                            rule: any,
                            val: any,
                            callback: Function
                        ) => {
                            if (!val || val.length < 1) {
                                callback(new Error("请选择分类"));
                            } else {
                                callback();
                            }
                        },
                        trigger: ["blur", "change"],
                    },
                ],
            },
            {
                type: CustomListColumnType.NUMBER,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                label: "定价",
                prop: "price",
                precision: 2,
                min: 1,
                max: 9999,
                formRule: [],
            },
            {
                type: CustomListColumnType.NUMBER,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                label: "套内册数",
                min: 1,
                max: 100,
                placeholder: "1表示非套装，其他数字表示一套书有几本",
                prop: "suit_num",
                formRule: [],
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                label: "出版社",
                prop: "publisher",
                formRule: [],
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                label: "可用库存",
                prop: "keyong",
                formRule: [],
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                label: "锁定库存",
                prop: "locked",
                formRule: [],
            },
            //   {
            //     type: CustomListColumnType.SELECT,
            //     label: "状态",
            //     canSearch: true,
            //     canAdd: true,
            //     canEdit: true,
            //     prop: "status",
            //     dataSource: {
            //       key: "value",
            //       value: [
            //         {
            //           label: "禁用",
            //           value: "locked",
            //         },
            //         {
            //           label: "正常",
            //           value: "normal",
            //         },
            //       ],
            //     },
            //   },
            {
                type: CustomListColumnType.DATE,
                label: "出版时间",
                prop: "pubdate",
                showInTable: true,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                formRule: [],
                dateFormat: "YYYY-MM-DD",
            },
            {
                type: CustomListColumnType.TEXT_ARRAY,
                label: "作者",
                prop: "authors",
                showInTable: false,
                canSearch: false,
                canAdd: true,
                canEdit: true,
            },
            {
                type: CustomListColumnType.TEXT_ARRAY,
                label: "译者",
                prop: "translators",
                showInTable: false,
                canSearch: false,
                canAdd: true,
                canEdit: true,
            },
            {
                type: CustomListColumnType.TEXT_ARRAY,
                label: "标签",
                prop: "tags",
                showInTable: false,
                canSearch: false,
                canAdd: true,
                canEdit: true,
            },
            {
                type: CustomListColumnType.TEXTAREA,
                label: "简介",
                prop: "brief",
                showInTable: false,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                width: "490px",
            },
            {
                type: CustomListColumnType.TEXTAREA,
                label: "目录",
                prop: "catalog",
                showInTable: false,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                width: "490px",
            },
        ],
        tableSelection: false,
        async onLoadData(searchForm: any, idata: IpageDataDto<any>) {
            const data = await getBookList({
                keyword: searchForm.keyword || "",
                category_id: searchForm.category_id,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            data.list = data.list.map((e) => {
                e.price = Number(Number(e.price).mul(0.01).toFixed(2));
                return e;
            });
            return data;
        },
        async onSave(form: any) {
            if (form.id) {
                const res = await editBook({
                    ...form,
                    price: parseInt(String(Number(form.price).mul(100))),
                });
                return res;
            } else {
                const res = await addBook({
                    ...form,
                    price: parseInt(String(Number(form.price).mul(100))),
                });
                return res;
            }
        },
    };

    private skuConfig: CustomListConf = {
        columns: [
            {
                type: CustomListColumnType.TEXT,
                canSearch: true,
                canAdd: true,
                canEdit: false,
                showInTable: true,
                label: "SKU编码",
                prop: "sku_no",
                placeholder: "可以留空，留空自动生成",
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
                canSearch: true,
                canAdd: true,
                canEdit: false,
                showInTable: false,
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
        onLoadData: () => {},
        onSave: async (form: any) => {
            form.goods_type = SkuType.BOOK;
            if (form.id) {
                const res = await editSku({
                    ...form,
                    price: parseInt(String(Number(form.price).mul(100))),
                });
                (this.$refs.booklist as any).refresh();
                return res;
            } else {
                const res = await addSku({
                    ...form,
                    price: parseInt(String(Number(form.price).mul(100))),
                });
                (this.$refs.booklist as any).refresh();
                return res;
            }
        },
    };

    private handleShowSkus(row: BookItem) {
        console.log(`this.ref`, this.$refs);
        this.activeBook = row;
        this.showSkuList = true;
    }

    private handleCreateSku(row: BookItem) {
        (this.$refs.skuform as EditForm).init({
            form: {
                sku_type: SkuType.BOOK,
                goods_id: row.id,
                num: 1,
            },
            readonly: false,
        });
    }

    private parseCate(cate: any[]) {
        return cate.map((e) => e.name).join("、");
    }
}
</script>
