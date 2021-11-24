<template>
    <div class="main">
        <div class="topSearch">
            <h2>我的充值记录</h2>
            <el-form :inline="true" :model="agentSearchData">
                <el-form-item label="创建时间：">
                    <el-date-picker v-model="agentSearchData.dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="充值方式：">
                    <el-select v-model="agentSearchData.type" placeholder="充值方式">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in rechargeWayOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="myRechargeList(1)">查询</el-button>
                    <el-button type="primary" @click="exportMyReg()" :disabled="disabled">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="agentRegTableData" style="width: 100%" show-summary :summary-method="getTotal" v-loading="dataListLoading"
                :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="80" label="序号">
                </el-table-column>
                <el-table-column prop="category" label="充值产品" align="center">
                    <template slot-scope="{ row }">
                        <span>{{ row.category === 0 ? '空号检测' : '实时检测' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payTime" label="充值时间" align="center">
                </el-table-column>
                <el-table-column prop="orderNo" label=" 订单编号" align="center">
                </el-table-column>
                <el-table-column prop="price" label="单价（元/条）" align="center" width="150">
                </el-table-column>
                <el-table-column prop="number" label="充值条数" align="center" width="150">
                </el-table-column>
                <el-table-column prop="money" label="充值金额（元）" width="120" align="center">
                </el-table-column>
                <el-table-column prop="payTypeName" label="方式" width="100" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination :key="pageIndex" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10,20,30,50]"
                :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataListLoading: false,
                disabled: false,
                number: '',
                money: '',
                agentSearchData: {
                    dateTime: [],
                    type: '',
                },
                agentRegTableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                },
                rechargeWayOptions: [
                    { label: '对公转账', value: 0 },
                    { label: '支付宝扫码付', value: 1 },
                    { label: '注册赠送', value: 2 },
                    { label: '赠送', value: 3 },
                    { label: '对公支付宝转账', value: 4 },
                    { label: '对私支付宝', value: 5 },
                    { label: '对私微信', value: 6 },
                    { label: '对私转账', value: 7 },
                ],
            }
        },
        activated() {
            this.myRechargeList(1)
        },
        methods: {
            myRechargeList(currPage) {
                this.dataListLoading = true
                this.pageIndex = currPage || this.pageIndex
                this.$http({
                    url: this.$http.adornUrl(`agent/finance/agent/recharge/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'payType': this.agentSearchData.type,
                        'startTime': '' || this.agentSearchData.dateTime == null ? '' : this.agentSearchData.dateTime[0],
                        'endTime': '' || this.agentSearchData.dateTime == null ? '' : this.agentSearchData.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.agentRegTableData = data.data.list
                        this.totalPage = data.data.total
                        this.money = data.data.totalInfo ? data.data.totalInfo.money : 0
                        this.number = data.data.totalInfo ? data.data.totalInfo.number : 0
                        if (data.data.list.length == 0) {
                            this.disabled = true
                        } else {
                            this.disabled = false
                        }
                    } else {
                        this.agentRegTableData = []
                        this.totalPage = 0
                        this.money = 0
                        this.number = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.myRechargeList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.myRechargeList()
            },
            getTotal(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (column.property === 'number') {
                        sums[index] = this.number
                        sums[index] += ' 条';
                    } else if (column.property === 'money') {
                        sums[index] = this.money
                        sums[index] += ' 元';
                    } else {
                        sums[index] = '';
                    }
                });
                return sums;
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
            },

            // 导出 
            exportMyReg() {
                let startTime;
                let endTime;
                if (this.agentSearchData.dateTime == null) {
                    startTime = ""
                    endTime = ""
                } else {
                    if (this.agentSearchData.dateTime.length == 0) {
                        startTime = ""
                        endTime = ""
                    } else {
                        startTime = this.agentSearchData.dateTime[0]
                        endTime = this.agentSearchData.dateTime[1]
                    }
                }

                window.open(this.$http.adornUrl(`agent/finance/my/recharge/list/export?token=${this.$cookie.get('token')}&currentPage=${this.pageIndex}&pageSize=${this.pageSize}&payType=${this.agentSearchData.type}&startTime=${startTime}&endTime=${endTime}`))
            }

        }
    }

</script>
<style lang="scss">
    .topSearch {
        width: 100%;
        padding: 10px 23px 20px;
        background-color: #ffffff;
        margin-bottom: 24px;
        box-shadow: 0px 7px 9px 0px rgba(153, 153, 153, 0.05);
    }
</style>