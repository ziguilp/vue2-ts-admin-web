<template>
    <div>
        <custom-list ref="list" :conf="config"> </custom-list>
    </div>
</template>

<script lang="ts">
import { UserModule } from "@/store/modules/user";
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import { getWaitForSettleList } from "@/api/settle";
import { isMobile } from "@/utils/validate";
import { IpageDataDto } from "@/api/types";
@Component({
    name: "WaitForSettleLog",
    components: {},
})
export default class extends Vue {
    private config: CustomListConf = {
        columns: [
            {
                type: CustomListColumnType.TEXT,
                label: "订单号",
                canSearch: true,
                showInTable: true,
                canAdd: false,
                canEdit: false,
                prop: "order_sn",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "商户",
                canSearch: true,
                canAdd: false,
                canEdit: false,
                prop: "merchant_id",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "订单金额",
                canSearch: false,
                canAdd: false,
                canEdit: false,
                prop: "total_amount",
                showFormatInTable: (row: any) => {
                    return Number(row.total_amount).div(100).toFixed(2);
                },
            },
            // {
            //     type: CustomListColumnType.TEXT,
            //     canSearch: false,
            //     canAdd: false,
            //     canEdit: false,
            //     label: "订单内容",
            //     prop: "order_goods",
            //     showFormatInTable: (row: any) => {
            //         return row.order_goods
            //             .map((e: any) => {
            //                 return e.goods_info.name;
            //             })
            //             .join("、");
            //     },
            {
                type: CustomListColumnType.DATE,
                dateFormat: "YYYY-MM-DD HH:mm:ss",
                prop: "first_order_date_received",
                label: "首次履约完成时间",
                canAdd: false,
                canEdit: false,
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getWaitForSettleList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };
}
</script>
