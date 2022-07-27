<template>
    <div class="dashboard-container">
        <el-row :gutter="30">
            <el-col :span="6" :sm="24" :lg="6" :md="6" :xs="24" :xl="6">
                <el-card>
                    <div slot="header">基础数据</div>
                    <div>
                       <el-row>
                         <el-col :span="12" class="b-item">
                            <h3>{{data.userTotal}}</h3>
                            <h5>用户总量</h5></h5>
                         </el-col>
                         <el-col :span="12" class="b-item">
                            <h3>{{data.bookTotal}}</h3>
                            <h5>书籍总量</h5>
                         </el-col>
                         <el-col :span="12" class="b-item">
                            <h3>{{data.borrowTotal}}</h3>
                            <h5>订单总量</h5>
                         </el-col>
                         <el-col :span="12" class="b-item">
                            <h3>{{data.borrowToday}}</h3>
                            <h5>今日订单</h5>
                         </el-col>
                       </el-row>
                    </div>
                </el-card>

               <el-card>
                    <div slot="header">运营数据</div>
                    <div>
                        <div class="weather-list">
                            <el-col class="weather-list-item" 
                                :xl="12"
                                :lg="12"
                                :md="24"
                                :sm="12"
                                :xs="24"
                            >
                                <svg-icon class="weather-list-item-icon" name="fuzhaoduzhong"></svg-icon>
                                <div class="weather-list-item-info">
                                    <span class="value">{{data.userTotal7d}} <i class="unit">人</i> </span>
                                    
                                    <h4 class="title">7日用户新增</h4>
                                </div>
                            </el-col>

                            <el-col class="weather-list-item" 
                                :xl="12"
                                :lg="12"
                                :md="24"
                                :sm="12"
                                :xs="24"
                            >
                                <svg-icon class="weather-list-item-icon" name="fuzhaoduzhi"></svg-icon>
                                <div class="weather-list-item-info">
                                    <span class="value">{{data.vipuserTotal7d}} <i class="unit">人</i> </span>
                                    
                                    <h4 class="title">7日会员新增</h4>
                                </div>
                            </el-col>

                            <el-col class="weather-list-item" 
                                :xl="12"
                                :lg="12"
                                :md="24"
                                :sm="12"
                                :xs="24"
                            >
                                <svg-icon class="weather-list-item-icon" name="fuzhaodusan"></svg-icon>
                                <div class="weather-list-item-info">
                                    <span class="value">{{data.borrow7d}} <i class="unit"></i> </span>
                                    
                                    <h4 class="title">7日订单新增</h4>
                                </div>
                            </el-col>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="18" :sm="24" :lg="18" :md="18" :xs="24" :xl="18">
                <el-card>
                    <div slot="header">30日趋势</div>
                    <div>
                        <div
                            ref="chart"
                            style="width: 100%;height:420px;"
                            id="shortTermPredict_chart"
                        ></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";

import * as echarts from "echarts/core";
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { dashboard } from "@/api/other";
import moment from "moment";

echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
]);

@Component({
    name: "Dashboard",
})
export default class extends Vue {
    private data: any = {};

    async created() {}

    mounted() {
        this.getDashBoard();
        // this.draw();
    }

    private async getDashBoard() {
        this.data = await dashboard();

        this.draw();
    }

    /**
     * 绘制图表
     */
    private async draw() {
        let {
            chart30: { users, vip, order },
        }: any = this.data;

        let days = [];
        for (let index = 30; index > -1; index--) {
            days.push(
                moment()
                    .add(0 - index, "days")
                    .format("YYYY-MM-DD")
            );
        }

        let usersDataObj: any = users.reduce((p: any, c: any) => {
            p[moment(c.date).format("YYYY-MM-DD")] = c.count;
            return p;
        }, {});

        let usersData: number[] = days.map((e: string) => {
            return usersDataObj[e] || 0;
        });

        let vipDataObj: any = vip.reduce((p: any, c: any) => {
            p[moment(c.date).format("YYYY-MM-DD")] = c.count;
            return p;
        }, {});

        let vipData: number[] = days.map((e: string) => {
            return vipDataObj[e] || 0;
        });

        let orderDataObj: any = order.reduce((p: any, c: any) => {
            p[moment(c.date).format("YYYY-MM-DD")] = c.count;
            return p;
        }, {});

        let orderData: number[] = days.map((e: string) => {
            return orderDataObj[e] || 0;
        });

        let chartDom: any = document.getElementById("shortTermPredict_chart");
        let myChart = echarts.init(chartDom);
        let option;

        option = {
            title: {
                text: "",
            },
            tooltip: {
                trigger: "axis",
            },
            legend: {
                data: ["注册用户", "会员人数", "订单数"],
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                },
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: days,
            },
            yAxis: {
                type: "value",
                name: "数",
            },
            series: [
                {
                    name: "注册用户",
                    type: "line",
                    data: usersData,
                },
                {
                    name: "会员人数",
                    type: "line",
                    data: vipData,
                },
                {
                    name: "订单数",
                    type: "line",
                    data: orderData,
                },
            ],
        };

        option && myChart.setOption(option);
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
        .fact {
            &-select {
                width: 100%;
                margin-top: 10px;
            }
            &-info {
                margin-top: 20px;
                &-row {
                    height: 48px;
                    box-sizing: border-box;
                    line-height: 48px;
                    &:nth-child(2n + 1) {
                        background: #fdf5e6;
                    }
                    &:nth-child(2n) {
                        background: #f0f9eb;
                    }
                }
            }
        }
    }
}

.weather-list {
    display: flex;
    flex-wrap: wrap;
    &-item {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        border: 1px dotted #80808063;
        border-radius: 10px;
        box-shadow: 0 1px 20px #7f787836;
        margin-top: 20px;
        &-icon {
            width: 32px;
            color: orange;
            font-size: 2rem;
            margin-right: 10px;
        }
        &-info {
            display: flex;
            flex-direction: column;
            p,
            h4 {
                padding: 0;
                margin: 0;
            }
            .value {
                font-size: 20px;
                line-height: 1.5;
                padding: 0;
            }
            .unit {
                font-size: 14px;
                line-height: 1.2;
                color: #b1b1b1;
                padding: 0;
            }
            .title {
                line-height: 1.5;
                font-size: 14px;
            }
        }
    }
}
@media only screen and (min-width: 768px) and (max-width: 991px) {
    .weather-list-item {
        width: 45%;
        &:nth-child(2n) {
            margin-left: 10%;
        }
    }
}

@media only screen and (min-width: 992px) and (max-width: 1300px) {
    .weather-list-item {
        width: 100%;
    }
}

@media only screen and (min-width: 1301px) {
    .weather-list-item {
        width: 45%;
        &:nth-child(2n) {
            margin-left: 10%;
        }
    }
}

.b-item {
    display: flex;
    flex-direction: column;
    height: 80px;
    align-items: center;
    justify-content: center;
    h3 {
        line-height: 2;
        margin: 0;
    }
    h5 {
        margin: 0;
        line-height: 1.2;
    }
}
</style>
