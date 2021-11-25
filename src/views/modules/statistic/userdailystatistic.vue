<template>
    <div class="main">
        <div class="topSearch">
            <h2>客户日统计列表</h2>
            <el-form :inline="true">
                <el-form-item>
                    <el-date-picker :clearable="false" v-model="searchData.createDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="getTableData(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="tableData" style="width: 100%" v-loading="dataListLoading" show-summary :summary-method="getTotal" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column width="150" prop="dayInt" label="日期" align="center">
                </el-table-column>
                <el-table-column v-if="isAdmin" min-width="150" prop="companyName" label="代理商名称" align="center">
                </el-table-column>
                <el-table-column min-width="150" prop="customerName" label="客户名称" align="center">
                </el-table-column>
                <el-table-column min-width="150" prop="phone" label="手机号码" align="center">
                </el-table-column>
                <el-table-column label="空号检测" align="center">
                    <!-- <el-table-column width="120" prop="emptyRechargeNum" label="充值条数" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.emptyRechargeNum || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="emptyRechargeMoney" label="充值金额" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.emptyRechargeMoney || 0 }}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column width="120" prop="emptyTotal" label="消耗条数" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.emptyTotal || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="realNumber" label="实号" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.realNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="silentNumber" label="沉默号" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.silentNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="emptyNumber" label="空号" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.emptyNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="riskNumber" label="风险号" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.riskNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="实时检测" align="center">
                    <!-- <el-table-column width="120" prop="realtimeRechargeNum" label="充值条数" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.realtimeRechargeNum || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="realtimeRechargeMoney" label="充值金额" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.realtimeRechargeMoney || 0 }}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column width="120" prop="realtimeTotal" label="消耗条数" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.realtimeTotal || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="normalNumber" label="正常号" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.normalNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="realtimeEmptyNumber" label="空号" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.realtimeEmptyNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="oncallNumber" label="通话中" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.oncallNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="notOnlineNumber" label="不在网" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.notOnlineNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="shutdownNumber" label="关机" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.shutdownNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="likeShutdownNumber" label="疑似关机" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.likeShutdownNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="tingjiNumber" label="停机" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.tingjiNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="mnpNumber" label="携号转网" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.mnpNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="moberrNumber" label="号码错误" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.moberrNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="unknownNumber" label="未知" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.unknownNumber || 0 }}</span>
                        </template>
                    </el-table-column>
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
    import { formatDate } from '@/utils'
    export default {
        data() {
            return {
                dataListLoading: false,
                searchData: {
                    createDate: [],
                },
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                agentSearchLoading: false,
                isAdmin: false,
                totalInfo: {}
            }
        },
        activated() {
            // msjRoleName 1：管理员 2：代理商
            this.isAdmin = Boolean(sessionStorage.getItem("msjRoleName") === "1")
            let currDate = formatDate(new Date(new Date()-24*60*60*1000))
            this.searchData = {
                createDate: [currDate, currDate],
            }
            this.getTableData(1)
        },
        methods: {
            getTableData(cur) {
                this.pageIndex = cur || this.pageIndex;
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/dailyStastics/listCustDaily?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'startTime': this.searchData.createDate && this.searchData.createDate[0] ? this.searchData.createDate[0] : undefined,
                        'endTime': this.searchData.createDate && this.searchData.createDate[1] ? this.searchData.createDate[1] : undefined,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.tableData = data.data.list
                        this.totalPage = data.data.total
                        this.totalInfo = data.data.totalInfo || {}
                    } else {
                        this.tableData = []
                        this.totalPage = 0
                        this.totalInfo = {}
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getTableData()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getTableData()
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === this.tableData.length) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
            },
            getTotal(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                    } else {
                        sums[index] = this.dealTotalColText(column.property)
                    }
                });

                return sums;
            },
            dealTotalColText(field) {
                if (this.totalInfo[field] || this.totalInfo[field] === 0) {
                    return this.totalInfo[field]
                }
                return ''
            },
        }
    }

</script>
<style lang="scss">
    .topSearch {
        width: 100%;
        padding: 10px 23px 20px;
        background-color: #fff;
        margin-bottom: 24px;
        box-shadow: 0px 7px 9px 0px rgba(153, 153, 153, 0.05);
    }
</style>