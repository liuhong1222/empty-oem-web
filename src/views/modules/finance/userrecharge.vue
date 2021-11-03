<template>
    <div class="main">
        <div class="topSearch">
            <h2>客户充值明细记录</h2>
            <el-form :inline="true" :model="customerSearchData" @keyup.enter.native="uerRechargeList()">
                <el-form-item label="创建时间：">
                    <el-date-picker v-model="customerSearchData.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions0"
                        onPick="uerRechargeList()">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="代理商名称：" style="margin-left:5px;" v-if="disableAgent">
                    <el-input v-model="customerSearchData.agentName" placeholder="代理商名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="客户名称：" style="margin-left:-2px;">
                    <el-input v-model="customerSearchData.custName" placeholder="客户名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号：" style="margin-left:10px;">
                    <el-input v-model="customerSearchData.custMobile" placeholder="手机号" clearable></el-input>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="uerRechargeList()">查询</el-button>
                    <el-button type="primary" @click="regExport()" :disabled="disabled">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="customerTableData" style="width: 100%" show-summary :summary-method="getTotal" v-loading="dataListLoading"
                :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="80" label="序号">
                </el-table-column>
                <el-table-column prop="payTime" label="充值时间" align="center">
                </el-table-column>
                <!-- <el-table-column prop="userId" label=" 客户编号" align="center">
                </el-table-column> -->
                <el-table-column prop="userName" label=" 客户名称" align="center">
                </el-table-column>
                <el-table-column prop="agentCompanyName" label="代理商名称" align="center" v-if="disableAgentName">
                </el-table-column>
                <el-table-column prop="userMobile" label="手机号" align="center">
                </el-table-column>
                <el-table-column prop="orderNo" label="订单编号" align="center">
                </el-table-column>
                <el-table-column prop="packageName" label="套餐选择" align="center">
                </el-table-column>
                <el-table-column prop="price" label="单价（元/条）" align="center">
                </el-table-column>
                <el-table-column prop="number" label="条数" align="center">
                </el-table-column>
                <el-table-column prop="money" label="金额（元）" align="center">
                </el-table-column>
                <el-table-column prop="payTypeName" label="充值方式" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10,20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                roleName: null,
                dataListLoading: false,
                disabled: false,
                disableAgent: true,
                disableAgentName: true,
                money: '',
                number: '',
                customerSearchData: {
                    dateTime: [],
                    agentName: '',
                    custName: '',
                    custMobile: ''
                },
                customerTableData: [],
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
            if (!this.customerSearchData.dateTime) {
                this.customerSearchData.dateTime = [];
                var date = new Date()
                this.customerSearchData.dateTime[0] = this.customerSearchData.dateTime[1] = this.formatDate(date)
            }
            if (this.$route.params && this.$route.params.custName) {
                this.customerSearchData.custName = this.$route.params.custName;
            }
            this.uerRechargeList();
        },
        created() {
            var date = new Date()
            this.customerSearchData.dateTime[0] = this.customerSearchData.dateTime[1] = this.formatDate(date)
        },
        methods: {
            formatDate(date) {
                var seperator1 = '-'
                var year = date.getFullYear()
                var month = date.getMonth() + 1
                var strDate = date.getDate()
                if (month >= 1 && month <= 9) {
                    month = '0' + month
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = '0' + strDate
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate
                return currentdate
            },
            // 获取数据列表
            uerRechargeList() {
                if (sessionStorage.getItem('msjRoleName') == '2') {
                    this.disableAgent = false
                    this.disableAgentName = false
                }
                this.dataListLoading = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/finance/user/recharge/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'companyName': this.customerSearchData.agentName,
                        'userName': this.customerSearchData.custName,
                        'userMobile': this.customerSearchData.custMobile,
                        'startTime': '' || this.customerSearchData.dateTime == null ? '' : this.customerSearchData.dateTime[0],
                        'endTime': '' || this.customerSearchData.dateTime == null ? '' : this.customerSearchData.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.customerTableData = data.data.list
                        this.totalPage = data.data.total
                        this.money = data.data.totalInfo.money
                        this.number = data.data.totalInfo.number
                        if (data.data.list.length == 0) {
                            this.disabled = true
                        } else {
                            this.disabled = false
                        }
                    } else {
                        this.customerTableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.uerRechargeList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.uerRechargeList()
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
            regExport() {
                let startTime;
                let endTime;
                if (this.customerSearchData.dateTime == null) {
                    startTime = ""
                    endTime = ""
                } else {
                    if (this.customerSearchData.dateTime.length == 0) {
                        startTime = ""
                        endTime = ""
                    } else {
                        startTime = this.customerSearchData.dateTime[0]
                        endTime = this.customerSearchData.dateTime[1]
                    }
                }
                window.open(this.$http.adornUrl(`agent/finance/user/recharge/list/export?token=${this.$cookie.get('token')}&currentPage=${this.pageIndex}&pageSize=${this.pageSize}&userName=${this.customerSearchData.custName}&companyName=${this.customerSearchData.agentName}&startTime=${startTime}&endTime=${endTime}`))
            },
            getNowFormatDate() {
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
            },
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