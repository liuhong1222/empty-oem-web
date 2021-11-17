<template>
    <div class="main">
        <div class="topSearch">
            <h2>客户消耗记录</h2>
            <el-form :inline="true" :model="consumeSearchData" @keyup.enter.native="consumeList(1)">
                <el-form-item label="创建时间：">
                    <el-date-picker v-model="consumeSearchData.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions0"
                        onPick="consumeList()">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="客户手机号：" style="margin-left:35px;">
                    <el-input v-model="consumeSearchData.mobile" placeholder="客户手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="代理商名称：" v-if="disableAgent">
                    <el-input v-model="consumeSearchData.agentName" placeholder="代理商名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="客户名称：" style="margin-left:-2px;">
                    <el-input v-model="consumeSearchData.custName" placeholder="客户名称" clearable></el-input>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="consumeList(1)">查询</el-button>
                    <el-button type="primary" :disabled="disabled" @click="consumeExport()">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="consumeTableData" style="width: 100%" show-summary :summary-method="getTotal" v-loading="dataListLoading"
                :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="80" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="客户名称" align="center">
                </el-table-column>
                <el-table-column prop="companyName" label="代理商名称" align="center" v-if="disableAgentName">
                </el-table-column>
                <el-table-column prop="category" label="产品名称" align="center">
                    <template slot-scope="{ row }">
                        <span>{{ row.category === 0 ? '空号检测' : '实时检测' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="检测时间" align="center">
                </el-table-column>
                <el-table-column prop="consumeNumber" label="消耗条数（条）" align="center">
                </el-table-column>
                <el-table-column prop="openingBalance" label="期初余条" align="center">
                </el-table-column>
                <el-table-column prop="closingBalance" label="期末余条" align="center">
                </el-table-column>
                <el-table-column prop="phone" label="手机号" align="center">
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
                dataListLoading: false,
                disabled: false,
                disableAgent: true,
                disableAgentName: true,
                number: '',
                consumeSearchData: {
                    dateTime: [],
                    agentName: "",
                    custName: '',
                    mobile: ''
                },
                consumeTableData: [],
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
            if (!this.consumeSearchData.dateTime) {
                this.consumeSearchData.dateTime = [];
                var date = new Date()
                this.consumeSearchData.dateTime[0] = this.consumeSearchData.dateTime[1] = this.formatDate(date)
            }
            this.consumeList(1)
        },
        created() {
            var date = new Date()
            this.consumeSearchData.dateTime[0] = this.consumeSearchData.dateTime[1] = this.formatDate(date)
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
            // 获取消耗记录接口
            consumeList(currPage) {
                if (sessionStorage.getItem('msjRoleName') == '2') {
                    this.disableAgent = false
                    this.disableAgentName = false
                }
                this.pageIndex = currPage || this.pageIndex
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/finance/user/consume/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'custMobile': this.consumeSearchData.mobile,
                        'companyName': this.consumeSearchData.agentName,
                        'userName': this.consumeSearchData.custName,
                        'startTime': '' || this.consumeSearchData.dateTime == null ? '' : this.consumeSearchData.dateTime[0],
                        'endTime': '' || this.consumeSearchData.dateTime == null ? '' : this.consumeSearchData.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.consumeTableData = data.data.list
                        this.totalPage = data.data.total
                        this.number = data.data.totalInfo.totalConsumeNum
                        if (data.data.list.length == 0) {
                            this.disabled = true
                        } else {
                            this.disabled = false
                        }
                    } else {
                        this.consumeTableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.consumeList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.consumeList()
            },
            getTotal(param) {
                const { columns, data } = param;
                // console.log(param)
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (column.property === 'consumeNumber') {
                        sums[index] = this.number
                        sums[index] += ' 条';
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
            consumeExport() {
                let startTime;
                let endTime;
                if (this.consumeSearchData.dateTime == null) {
                    this.$message.warning('请选择开始时间和结束时间，跨度最多为1个月!')
                    return
                    // alert(333)
                    // startTime = ""
                    // endTime = ""
                } else {
                    if (this.consumeSearchData.dateTime.length == 0) {
                        this.$message.warning('请选择开始时间和结束时间，跨度最多为1个月!')
                        return
                        // startTime = ""
                        // endTime = ""
                    } else {
                        let aDay = 24 * 60 * 60 * 1000;
                        let diffDay = (new Date(this.consumeSearchData.dateTime[1]) - new Date(this.consumeSearchData.dateTime[0])) / aDay
                        console.log(diffDay)
                        // this.$message.success('跨度最多为'+diffDay+'天，可以进行导出')
                        if (diffDay > 30) {
                            this.$message.warning('跨度最多为1个月(30天)')
                            return
                        }
                        startTime = this.consumeSearchData.dateTime[0]
                        endTime = this.consumeSearchData.dateTime[1]
                    }
                }
                window.open(this.$http.adornUrl(`agent/finance/user/consume/list/export?token=${this.$cookie.get('token')}&currentPage=${this.pageIndex}&pageSize=${this.pageSize}&userName=${this.consumeSearchData.custName}&companyName=${this.consumeSearchData.agentName}&custMobile=${this.consumeSearchData.mobile}&startTime=${startTime}&endTime=${endTime}`))

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