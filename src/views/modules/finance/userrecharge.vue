<template>
    <div class="main">
        <div class="topSearch">
            <h2>客户充值记录</h2>
            <el-form :inline="true" :model="customerSearchData" @keyup.enter.native="uerRechargeList(1)">
                <el-form-item label="创建时间：">
                    <el-date-picker v-model="customerSearchData.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions0"
                        onPick="uerRechargeList()">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="代理商：" v-if="disableAgent">
                    <el-select v-model="customerSearchData.agentName" style="width: 220px;" placeholder="请选择代理商">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option v-for="(item, index) in agentList" :label="item.companyName" :key="index" :value="item.id + ''"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户名称：">
                    <el-input style="width: 200px;" v-model="customerSearchData.custName" placeholder="请输入客户名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input style="width: 200px;" v-model="customerSearchData.custMobile" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="产品名称：">
                    <el-select style="width: 220px;" v-model="customerSearchData.category" placeholder="请选择产品名称">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option v-for="item in categoryOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="uerRechargeList(1)">查询</el-button>
                    <el-button type="primary" @click="regExport()" :disabled="disabled">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="customerTableData" style="width: 100%" show-summary :summary-method="getTotal" v-loading="dataListLoading"
                :header-cell-style="getRowClass">
                <el-table-column type="index" fixed="left" header-align="center" align="center" width="80" label="序号">
                </el-table-column>
                <el-table-column prop="phone" fixed="left" width="150" label="手机号" align="center">
                </el-table-column>
                <el-table-column prop="companyName" width="150" label="代理商名称" align="center" v-if="disableAgentName">
                </el-table-column>
                <el-table-column prop="name" width="150" label=" 客户名称" align="center">
                </el-table-column>
                <el-table-column prop="creatorName" width="150" label="操作账号" align="center">
                </el-table-column>
                <el-table-column prop="category" label="产品名称" align="center">
                    <template slot-scope="{ row }">
                        <span>{{ categoryLabelMap[row.category] || '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNo" min-width="150" label="订单编号" align="center">
                </el-table-column>
                <el-table-column prop="createTime" width="150" label="充值时间" align="center">
                </el-table-column>
                <el-table-column prop="goodsName" width="150" label="套餐" align="center">
                </el-table-column>
                <el-table-column prop="price" width="150" label="单价（元/条）" align="center">
                </el-table-column>
                <el-table-column prop="rechargeNumber" width="150" label="条数" align="center">
                </el-table-column>
                <el-table-column prop="paymentAmount" width="150" label="金额（元）" align="center">
                </el-table-column>
                <el-table-column prop="payType" label="充值方式" align="center">
                    <template slot-scope="{ row }">
                        <span>{{ payTypeMap[row.payType] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="openingBalance" width="150" label="期初余条" align="center">
                </el-table-column>
                <el-table-column prop="closingBalance" width="150" label="期末余条" align="center">
                </el-table-column>
                <el-table-column prop="remark" min-width="150" label="备注" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination :key="pageIndex" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10,20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import { categoryOptions, categoryLabelMap } from '@/const'
    export default {
        data() {
            return {
                categoryLabelMap,
                roleName: null,
                dataListLoading: false,
                disabled: false,
                disableAgent: true,
                disableAgentName: true,
                money: '',
                number: '',
                customerSearchData: {
                    dateTime: [],
                    agentName: '-1',
                    custName: '',
                    custMobile: '',
                    category: '-1',
                },
                categoryOptions,
                customerTableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                },
                payTypeMap: {
                    '0': '对公转账',
                    '1': '支付宝扫码付',
                    '2': '注册赠送',
                    '3': '赠送',
                    '4': '对公支付宝转账',
                    '5': '对私支付宝',
                    '6': '对私微信',
                    '7': '对私转账',
                    '8': '微信扫码付',
                    '10': '认证赠送',
                },
                agentList: [],
                agentListMap: {},
                isAdmin: false,
            }
        },
        activated() {
            if (!this.customerSearchData.dateTime) {
                this.customerSearchData.dateTime = [];
                var date = new Date()
                this.customerSearchData.dateTime[0] = this.customerSearchData.dateTime[1] = this.formatDate(date)
            }
            if (this.$route.params && this.$route.params.phone) {
                this.customerSearchData.custMobile = this.$route.params.phone;
                this.customerSearchData.dateTime = []
            }
            if (sessionStorage.getItem('msjRoleName') == '2') {
                this.disableAgent = false
                this.disableAgentName = false
            }
            this.isAdmin = Boolean(sessionStorage.getItem('msjRoleName') == '1')
            this.isAdmin && this.getAgentList()
            this.uerRechargeList(1);
        },
        created() {
            var date = new Date()
            this.customerSearchData.dateTime[0] = this.customerSearchData.dateTime[1] = this.formatDate(date)
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
            uerRechargeList(currPage) {
                this.dataListLoading = true;
                this.pageIndex = currPage || this.pageIndex
                this.$http({
                    url: this.$http.adornUrl(`agent/finance/user/recharge/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'companyName': this.isAdmin ? this.agentListMap[this.customerSearchData.agentName] : undefined,
                        'userName': this.customerSearchData.custName,
                        'category': this.customerSearchData.category === '-1' ? undefined : this.customerSearchData.category,
                        'custMobile': this.customerSearchData.custMobile,
                        'startTime': '' || this.customerSearchData.dateTime == null ? '' : this.customerSearchData.dateTime[0],
                        'endTime': '' || this.customerSearchData.dateTime == null ? '' : this.customerSearchData.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.customerTableData = data.data.list
                        this.totalPage = data.data.total
                        this.money = data.data.totalInfo ? data.data.totalInfo.totalRechargeMoney : 0
                        this.number = data.data.totalInfo ? data.data.totalInfo.totalRechargeNum : 0
                        if (data.data.list.length == 0) {
                            this.disabled = true
                        } else {
                            this.disabled = false
                        }
                    } else {
                        this.customerTableData = []
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
                    if (column.property === 'rechargeNumber') {
                        sums[index] = this.number
                        sums[index] += ' 条';
                    } else if (column.property === 'paymentAmount') {
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
                window.open(this.$http.adornUrl(`agent/finance/user/recharge/list/export?token=${this.$cookie.get('token')}&currentPage=${this.pageIndex}&pageSize=${this.pageSize}&userName=${this.customerSearchData.custName}&companyName=${this.agentListMap[this.customerSearchData.agentName] || ''}&startTime=${startTime}&endTime=${endTime}&custMobile=${this.customerSearchData.custMobile}`))
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