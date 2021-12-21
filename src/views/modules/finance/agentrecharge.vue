<template>
    <div class="main">
        <div class="topSearch">
            <h2>代理商充值记录</h2>
            <el-form :inline="true" :model="OEMSearchData" @keyup.enter.native="agentRechargeList(1)">
                <el-form-item label="创建时间：">
                    <el-date-picker v-model="OEMSearchData.dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="代理商：">
                    <el-select v-model="OEMSearchData.agentName" style="width: 220px;" placeholder="请选择代理商">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option v-for="(item, index) in agentList" :label="item.companyName" :key="index" :value="item.id + ''"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="OEMSearchData.agentMobile" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="充值方式：">
                    <el-select v-model="OEMSearchData.type" placeholder="请选择充值方式">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in rechargeWayOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品名称：">
                    <el-select v-model="OEMSearchData.category" placeholder="请选择产品名称">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option v-for="item in categoryOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="agentRechargeList(1)">查询</el-button>
                    <el-button type="primary" @click="exportxsl()" :disabled="disabled">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="agentOemTableData" style="width: 100%" show-summary :summary-method="getTotal" v-loading="dataListLoading"
                :header-cell-style="getRowClass">
                <el-table-column type="index" fixed="left" header-align="center" align="center" width="80" label="序号">
                </el-table-column>
                <el-table-column prop="agentId" min-width="150" label="代理商序号" align="center">
                    <template slot-scope="{ row }">
                        <span>{{ row.agentId + '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="companyName" min-width="150" label="代理商名称" align="center">
                </el-table-column>
                <el-table-column prop="agentMobile" min-width="150" label="手机号" align="center">
                </el-table-column>
                <el-table-column prop="payTime" width="150" label="充值时间" align="center">
                </el-table-column>
                <el-table-column prop="orderNo" width="150" label=" 订单编号" align="center">
                </el-table-column>
                <el-table-column prop="levelName" width="150" label="代理等级" align="center">
                </el-table-column>
                <el-table-column prop="price" width="150" label="单价（元/条）" align="center">
                </el-table-column>
                <el-table-column prop="number" width="150" label="条数" align="center">
                </el-table-column>
                <el-table-column prop="money" width="150" label="金额（元）" align="center">
                </el-table-column>
                <el-table-column prop="payTypeName" label="方式" width="120" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination :key="pageIndex" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20,30,50]"
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
                    agentName: "-1",
                    type: '',
                    agentMobile: '',
                    category: '-1',
                },
                categoryOptions: [
                    { label: '空号检测', value: 0 },
                    { label: '实时检测', value: 1 },
                ],
                agentOemTableData: [],
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
                agentList: [],
                agentListMap: {},
            }
        },
        activated() {
            this.agentRechargeList(1)
            this.getAgentList()
        },
        methods: {
            getAgentList() {
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/listAgent?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.agentList = data.data || []
                        this.agentListMap = this.agentList.reduce((pre, curr) => {
                            return { ...pre, [curr.id + '']: curr.companyName }
                        }, {})
                    } else {
                        this.agentList = []
                        this.agentListMap = {}
                    }
                })
            },
            agentRechargeList(currPage) {
                this.dataListLoading = true
                this.pageIndex = currPage || this.pageIndex
                this.$http({
                    url: this.$http.adornUrl(`agent/finance/agent/recharge/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'companyName': this.agentListMap[this.OEMSearchData.agentName],
                        'agentMobile': this.OEMSearchData.agentMobile,
                        'payType': this.OEMSearchData.type,
                        'category': this.OEMSearchData.category === '-1' ? undefined : this.OEMSearchData.category,
                        'startTime': '' || this.OEMSearchData.dateTime == null ? '' : this.OEMSearchData.dateTime[0],
                        'endTime': '' || this.OEMSearchData.dateTime == null ? '' : this.OEMSearchData.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.agentOemTableData = data.data.list
                        this.totalPage = data.data.total
                        this.money = data.data.totalInfo ? data.data.totalInfo.money : 0
                        this.number = data.data.totalInfo ? data.data.totalInfo.number : 0
                        if (data.data.list.length == 0) {
                            this.disabled = true
                        } else {
                            this.disabled = false
                        }
                    } else {
                        this.agentOemTableData = []
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
                window.open(this.$http.adornUrl(`agent/finance/agent/recharge/list/export?token=${this.$cookie.get('token')}&currentPage=${this.pageIndex}&pageSize=${this.pageSize}&companyName=${this.agentListMap[this.OEMSearchData.agentName] || ''}&agentMobile=${this.OEMSearchData.agentMobile}&payType=${this.OEMSearchData.type}&startTime=${startTime}&endTime=${endTime}`))
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