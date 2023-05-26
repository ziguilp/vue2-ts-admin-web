<template>
    <div class="app-container">
        <el-card v-if="searchFormCloumns && searchFormCloumns.length > 0">
            <div>
                <CustomForm :columns="searchFormCloumns" ref="searchForm">
                    <el-button-group>
                        <el-button type="primary" @click="submit(true)"
                            >确认</el-button
                        >
                        <el-dropdown
                            @command="exportFile"
                            v-if="
                                $permission.can(conf.permissionExportMark) &&
                                conf.onExport
                            "
                        >
                            <el-button type="success">
                                导出<i
                                    class="el-icon-arrow-down el-icon--right"
                                ></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="csv"
                                    >CSV</el-dropdown-item
                                >
                                <el-dropdown-item command="xls"
                                    >XLS</el-dropdown-item
                                >
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-button-group>
                </CustomForm>
            </div>
        </el-card>

        <el-card>
            <div slot="header">
                <slot name="tools">
                    <el-button
                        type="primary"
                        icon="el-icon-refresh"
                        @click="refresh"
                        :loading="loading"
                    ></el-button>
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        @click="handleAdd"
                        v-if="
                            conf.onSave &&
                            $permission.can(conf.permissionAddMark)
                        "
                        >新增</el-button
                    >
                </slot>
                <slot name="header-tools"></slot>
            </div>
            <div>
                <el-table
                    :data="data.list"
                    style="width: 100%"
                    ref="table"
                    @sort-change="handleSortChange"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        width="55"
                        v-if="conf.tableSelection === true"
                    >
                    </el-table-column>
                    <template v-for="(v, i) in tableCloumns">
                        <el-table-column
                            :key="`custom-list-table-${v.prop}-${i}`"
                            :prop="v.prop"
                            :label="v.label"
                            :sortable="v.sortable"
                            :width="v.width || ''"
                        >
                            <template slot-scope="scope">
                                <slot :name="v.prop" v-bind:row="scope.row">
                                    <template v-if="v.type === 'image'">
                                        <el-image
                                            class="table-image"
                                            v-if="
                                                getValueByKey(scope.row, v.prop)
                                            "
                                            :src="
                                                getValueByKey(scope.row, v.prop)
                                            "
                                            :fit="'cover'"
                                            :preview-src-list="[
                                                getValueByKey(
                                                    scope.row,
                                                    v.prop
                                                ),
                                            ]"
                                            lazy
                                        ></el-image>
                                        <el-tag v-else>无图</el-tag>
                                    </template>
                                    <div v-else-if="v.type === 'images'">
                                        <el-image
                                            class="table-image"
                                            v-for="(
                                                item, index
                                            ) in getValueByKey(
                                                scope.row,
                                                v.prop
                                            )"
                                            :key="'table_row-images-' + index"
                                            :src="item"
                                            :fit="'cover'"
                                            :preview-src-list="
                                                getValueByKey(scope.row, v.prop)
                                            "
                                            lazy
                                        ></el-image>
                                    </div>
                                    <template
                                        v-else-if="
                                            v.type === 'select' &&
                                            v.dataSource.value
                                        "
                                    >
                                        <el-tag
                                            :type="
                                                formatEnum(
                                                    v,
                                                    getValueByKey(
                                                        scope.row,
                                                        v.prop
                                                    )
                                                ).type
                                            "
                                            >{{
                                                formatEnum(
                                                    v,
                                                    getValueByKey(
                                                        scope.row,
                                                        v.prop
                                                    )
                                                ).label
                                            }}</el-tag
                                        >
                                    </template>
                                    <template
                                        v-else-if="v.type === 'text-array'"
                                    >
                                        <el-popover
                                            placement="top-start"
                                            :title="v.label"
                                            width="200"
                                            trigger="hover"
                                            :content="
                                                buidTextArray(
                                                    getValueByKey(
                                                        scope.row,
                                                        v.prop
                                                    ),
                                                    '/',
                                                    '-'
                                                )
                                            "
                                        >
                                            <el-tag slot="reference">{{
                                                buidTextArray(
                                                    getValueByKey(
                                                        scope.row,
                                                        v.prop
                                                    ),
                                                    "、",
                                                    "-"
                                                )
                                            }}</el-tag>
                                        </el-popover>
                                    </template>
                                    <template
                                        v-else-if="
                                            v.type === 'date' ||
                                            v.type === 'datetime'
                                        "
                                        >{{
                                            dateFormat(
                                                getValueByKey(
                                                    scope.row,
                                                    v.prop
                                                ),
                                                v.dateFormat
                                            )
                                        }}</template
                                    >
                                    <template
                                        v-else-if="
                                            v.type === 'datet-ranger' ||
                                            v.type === 'datetime-ranger'
                                        "
                                        >{{
                                            dateFormat(
                                                getValueByKey(
                                                    scope.row,
                                                    v.prop
                                                )[0],
                                                v.dateFormat
                                            )
                                        }}~{{
                                            dateFormat(
                                                getValueByKey(
                                                    scope.row,
                                                    v.prop
                                                )[1],
                                                v.dateFormat
                                            )
                                        }}</template
                                    >
                                    <template v-else-if="v.showFormatInTable">{{
                                        v.showFormatInTable(scope.row)
                                    }}</template>
                                    <template v-else>{{
                                        getValueByKey(scope.row, v.prop)
                                    }}</template>
                                </slot>
                            </template>
                        </el-table-column>
                    </template>

                    <el-table-column
                        label="操作"
                        width="200"
                        fixed="right"
                        v-if="!conf.hideOperations"
                    >
                        <template slot-scope="scope">
                            <slot name="operations" v-bind:row="scope.row">
                                <el-button-group>
                                    <el-button
                                        v-if="
                                            conf.onSave &&
                                            $permission.can(
                                                conf.permissionUpdateMark
                                            )
                                        "
                                        type="text"
                                        size="small"
                                        @click="handleEdit(scope.row)"
                                        >修改<el-divider
                                            direction="vertical"
                                        ></el-divider>
                                    </el-button>

                                    <el-button
                                        type="text"
                                        size="small"
                                        @click="handleShow(scope.row)"
                                        >详情
                                        <el-divider
                                            direction="vertical"
                                        ></el-divider
                                    ></el-button>

                                    <el-button
                                        type="text"
                                        v-if="
                                            conf.onDelete &&
                                            $permission.can(
                                                conf.permissionDeleteMark
                                            )
                                        "
                                        size="small"
                                        @click="handleDel(scope.row)"
                                    >
                                        删除
                                    </el-button>
                                </el-button-group>
                            </slot>
                            <slot name="extbtns" v-bind:row="scope.row"> </slot>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    class="turbo-pagination"
                    layout="total, sizes, prev, pager, next"
                    :current-page="data.currentPage * 1"
                    :page-size="data.pageSize * 1"
                    :total="data.total * 1"
                    @size-change="sizeChange"
                    @current-change="pageChange"
                ></el-pagination>
            </div>
        </el-card>

        <EditForm
            ref="EditForm"
            :title="formTitle"
            :conf="conf"
            @refresh="refresh"
        ></EditForm>
    </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Prop, Vue, Watch } from "vue-property-decorator";
import exportFromJSON, { ExportType } from "export-from-json";
import moment from "moment";
import { CustomListColumn, CustomListConf } from "./customType";
import CustomForm from "./cps/form.vue";
import Component from "vue-class-component";
import EditForm from "./editForm.vue";
import { IpageDataDto } from "@/api/types";

@Component({
    name: "CustomList",
    components: {
        CustomForm,
        EditForm,
    },
})
export default class CustomList extends Vue {
    @Prop({
        type: Object as PropType<CustomListConf>,
        required: true,
    })
    readonly conf!: CustomListConf;

    private formTitle = "";

    get searchFormCloumns() {
        return this.conf.columns.reduce((p, c) => {
            if (c.canSearch) {
                p.push(c);
            }
            return p;
        }, [] as CustomListColumn[]);
    }

    get tableCloumns() {
        return this.conf.columns.reduce((p, c) => {
            if (c.showInTable !== false) {
                p.push(c);
            }
            return p;
        }, [] as CustomListColumn[]);
    }

    private loading = false;

    private data: IpageDataDto<any> = {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        list: [],
    };

    private selectedRows: any[] = [];

    async sizeChange(e: any) {
        this.data.pageSize = e;
        this.data.currentPage = 1;
        this.getList();
    }

    pageChange(e: any) {
        this.data.currentPage = e;
        this.getList();
    }

    async mounted() {
        this.getList(true);
    }

    public refresh(refreshPage = true) {
        if (refreshPage) this.data.currentPage = 1;
        this.getList();
    }

    private submit() {
        this.refresh();
    }

    private handleAdd() {
        this.formTitle = "新增";
        (this.$refs.EditForm as EditForm).init({
            readonly: false,
        });
    }

    private handleEdit(row: any) {
        this.formTitle = "编辑";
        (this.$refs.EditForm as EditForm).init({
            form: row,
            readonly: false,
        });
    }

    private handleShow(row: any) {
        this.formTitle = "详情";
        (this.$refs.EditForm as EditForm).init({ form: row, readonly: true });
    }

    private handleSelectionChange(e: any[]) {
        this.selectedRows = e;
    }

    private async getList(refresh = false) {
        try {
            this.loading = true;
            this.data = await this.conf.onLoadData(
                this.$refs.searchForm
                    ? (this.$refs.searchForm as CustomForm).getFormValue()
                    : {},
                this.data
            );
        } catch (error) {
            console.error(error);
        } finally {
            this.loading = false;
        }
    }

    private handleDel(row: any) {
        this.$turboConfirm
            .confirm({
                type: "warning",
                title: "确定要删除当前记录吗？",
                content: "你将无法恢复该数据！",
            })
            .then(async () => {
                const res = this.conf.onDelete
                    ? await this.conf.onDelete(row)
                    : false;
                if (res) {
                    this.refresh();
                }
            })
            .catch((e) => {
                console.log("取消");
            });
    }

    private async exportFile(exportType: ExportType) {
        try {
            // const { data } = await getAllLimitList(this.form.factId, time_start, time_end, {
            //     page: 1,
            //     pageSize: this.logData.total
            // })
            // const fileName = `${this.selectedFact?.name}-${moment().format('YYYYMMDDHHmm')}`
            // exportFromJSON({ data: data.list, fileName, exportType })
        } catch (error) {
            console.error(error);
        }
    }

    private async handleSortChange(sort: any) {
        if (!(sort instanceof Array)) {
            sort = [sort];
        }
        const sortBy = sort.reduce((p: any, c: any) => {
            p[c.prop] = /^asc/.test(c.order) ? "ASC" : "DESC";
            return p;
        }, {});

        if (this.conf.onSortChange) {
            this.loading = true;
            try {
                this.data = await this.conf.onSortChange(
                    this.$refs.searchForm
                        ? (this.$refs.searchForm as CustomForm).getFormValue()
                        : {},
                    this.data,
                    sortBy
                );
            } catch (error) {
            } finally {
                this.loading = false;
            }
        }
    }

    private dateFormat(v: any, format = "YYYY-MM-DD HH:mm:ss") {
        return v ? moment(v).format(format) : "-";
    }

    private getValueByKey(o: any, key: string) {
        const ks = key.split(".");
        if (ks.length == 1) return o[key];
        let res: any = {
            ...o,
        };
        for (let index = 0; index < ks.length; index++) {
            const k = ks[index];
            res = res[k];
        }
        return res;
    }

    private formatEnum(column: CustomListColumn, value: any) {
        if (
            column.dataSource &&
            column.dataSource.value &&
            column.dataSource.value instanceof Array
        ) {
            const conf = ["danger", "success", "warning", "info", "primary"];
            const i = column.dataSource.value.findIndex(
                (v: any) => v[column.dataSource?.key || "id"] === value
            );
            if (i > -1) {
                return {
                    label: column.dataSource.value[i][
                        column.dataSource?.labelKey || "label"
                    ],
                    type: conf[i % 5],
                };
            }
        }
        return {
            label: value,
            type: "primary",
        };
    }

    private buidTextArray(txts: string[], glue = "、", defaultVal = "") {
        const res = txts && txts.length > 0 ? txts.join(glue) : defaultVal;
        return res;
    }
}
</script>

<style lang="scss">
.table-image img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    object-fit: cover;
}
</style>
