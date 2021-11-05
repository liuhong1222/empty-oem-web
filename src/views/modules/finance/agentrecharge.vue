<template>
    <div class="main">
        <div class="topSearch">
            <h2>代理商充值记录</h2>
            <el-form :inline="true" :model="OEMSearchData" @keyup.enter.native="agentRechargeList()">
                <el-form-item label="创建时间：">
                    <el-date-picker v-model="OEMSearchData.dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="代理商名称：" style="margin-left:25px;">
                    <el-input v-model="OEMSearchData.agentName" placeholder="代理商名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号：" style="margin-left:10px;">
                    <el-input v-model="OEMSearchData.agentMobile" placeholder="手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="充值方式：">
                    <el-select v-model="OEMSearchData.type" placeholder="代理商状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="支付宝" value="1"></el-option>
                        <el-option label="对公转账" value="5"></el-option>
                        <el-option label="赠送" value="6"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="agentRechargeList()">查询</el-button>
                    <el-button type="primary" @click="exportxsl()" :disabled="disabled">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="agentOemTableData" style="width: 100%" show-summary :summary-method="getTotal" v-loading="dataListLoading"
                :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="80" label="序号">
                </el-table-column>
                <el-table-column prop="agentId" label="代理商序号" align="center">
                </el-table-column>
                <el-table-column prop="companyName" label="代理商名称" align="center">
                </el-table-column>
                <el-table-column prop="agentMobile" label="手机号" align="center">
                </el-table-column>
                <el-table-column prop="payTime" label="充值时间" align="center">
                </el-table-column>
                <el-table-column prop="orderNo" label=" 订单编号" align="center">
                </el-table-column>
                <el-table-column prop="levelName" label="代理等级" align="center">
                </el-table-column>
                <el-table-column prop="price" label="单价（元/条）" align="center">
                </el-table-column>
                <el-table-column prop="number" label="条数" align="center">
                </el-table-column>
                <el-table-column prop="money" label="金额（元）" align="center">
                </el-table-column>
                <el-table-column prop="payTypeName" label="方式" width="120" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20,30,50]"
                :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                disabled: false,
                dataListLoading: false,
                money: '',
                number: '',
                OEMSearchData: {
                    dateTime: [],
                    agentName: "",
                    type: '',
                    agentMobile: ''
                },
                agentOemTableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                }
            }
        },
        activated() {
            this.agentRechargeList()
        },
        methods: {
            // 获取退款记录接口
            agentRechargeList() {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/finance/agent/recharge/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'companyName': this.OEMSearchData.agentName,
                        'agentMobile': this.OEMSearchData.agentMobile,
                        'payType': this.OEMSearchData.type,
                        'startTime': '' || this.OEMSearchData.dateTime == null ? '' : this.OEMSearchData.dateTime[0],
                        'endTime': '' || this.OEMSearchData.dateTime == null ? '' : this.OEMSearchData.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        // console.log(data)
                        this.agentOemTableData = data.data.list
                        this.totalPage = data.data.total
                        this.money = data.data.totalInfo.money
                        this.number = data.data.totalInfo.number
                        if (data.data.list.length == 0) {
                            this.disabled = true
                        } else {
                            this.disabled = false
                        }
                    } else {
                        this.agentOemTableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.agentRechargeList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.agentRechargeList()
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
                        sums[index] = '--';
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
            exportxsl() {
                let startTime;
                let endTime;
                if (this.OEMSearchData.dateTime == null) {
                    startTime = ""
                    endTime = ""
                } else {
                    if (this.OEMSearchData.dateTime.length == 0) {
                        startTime = ""
                        endTime = ""
                    } else {
                        startTime = this.OEMSearchData.dateTime[0]
                        endTime = this.OEMSearchData.dateTime[1]
                    }
                }
                window.open(this.$http.adornUrl(`agent/finance/agent/recharge/list/export?token=${this.$cookie.get('token')}&currentPage=${this.pageIndex}&pageSize=${this.pageSize}&companyName=${this.OEMSearchData.agentName}&agentMobile=${this.OEMSearchData.agentMobile}&payType=${this.OEMSearchData.type}&startTime=${startTime}&endTime=${endTime}`))
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