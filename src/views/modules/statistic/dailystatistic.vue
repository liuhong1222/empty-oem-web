<template>
    <div class="main">
        <div class="topSearch">
            <h2>日统计列表</h2>
            <el-form :inline="true">
                <el-form-item>
                    <el-date-picker v-model="searchData.createDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="isAdmin" label="代理商名称：" style="margin-left:35px;">
                    <el-select
                        v-model="searchData.agentId"
                        filterable
                        remote
                        clearable
                        reserve-keyword
                        placeholder="请输入代理商名称"
                        :remote-method="getAgentList"
                        :loading="agentSearchLoading"
                    >
                        <el-option
                            v-for="(item, index) in agentList"
                            :key="index"
                            :label="item.companyName"
                            :value="item.id + ''"
                        >
                        </el-option>
                    </el-select>
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
                <el-table-column min-width="120" prop="custNum" label="用户数" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.custNum || 0 }}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="120" prop="dailyAddCustNum" label="新增用户数" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dailyAddCustNum || 0 }}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="120" prop="totalPayment" label="充值金额" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.totalPayment || 0 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="空号检测" align="center">
                    <el-table-column width="120" prop="emptyConsume" label="消耗条数" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.emptyConsume || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="emptyCounts" label="剩余条数" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.emptyCounts || 0 }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="实时检测" align="center">
                    <el-table-column width="120" prop="realtimeConsume" label="消耗条数" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.realtimeConsume || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="realtimeCounts" label="剩余条数" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.realtimeCounts || 0 }}</span>
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
                    agentId: undefined,
                },
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                isAdmin: false,
                agentSearchLoading: false,
            }
        },
        activated() {
            // msjRoleName 1：管理员 2：代理商
            this.isAdmin = Boolean(sessionStorage.getItem("msjRoleName") === "1")
            this.isAdmin && this.getAgentList()
            let currDate = formatDate(new Date(new Date()-24*60*60*1000))
            this.searchData = {
                createDate: [currDate, currDate],
                agentId: undefined,
            }
            this.getTableData(1)
        },
        methods: {
            getTableData(cur) {
                this.pageIndex = cur || this.pageIndex;
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/dailyStastics/listAgentDaily?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'agentId': this.isAdmin ? this.searchData.agentId : this.$json.parse(sessionStorage.getItem('agentInfo') || '{}').id + '',
                        'startTime': this.searchData.createDate && this.searchData.createDate[0] ? this.searchData.createDate[0] : undefined,
                        'endTime': this.searchData.createDate && this.searchData.createDate[1] ? this.searchData.createDate[1] : undefined,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.tableData = data.data.list
                        this.totalPage = data.data.total
                    } else {
                        this.tableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 获取代理商列表
            getAgentList(name) {
                this.agentSearchLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/listAgent?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        name: name || undefined
                    })
                }).then(({ data }) => {
                    this.agentSearchLoading = false
                    if (data && data.code === 0) {
                        this.agentList = data.data || []
                    } else {
                        this.agentList = []
                    }
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
                        return;
                    }
                    switch (column.property) {
                        // case 'userCount': {
                        //     sums[index] = `${0}`;
                        //     break;
                        // }
                        // case 'newUserCount': {
                        //     sums[index] = `${0}`;
                        //     break;
                        // }
                        // case 'rechargeNum': {
                        //     sums[index] = `${0}`;
                        //     break;
                        // }
                        // case 'emptyUseCount': {
                        //     sums[index] = `${0}`;
                        //     break;
                        // }
                        // case 'emptyRemainCount': {
                        //     sums[index] = `${0}`;
                        //     break;
                        // }
                        // case 'realUseCount': {
                        //     sums[index] = `${0}`;
                        //     break;
                        // }
                        // case 'realRemainCount': {
                        //     sums[index] = `${0}`;
                        //     break;
                        // }
                        default:
                            sums[index] = ``;
                            break;
                    }
                });

                return sums;
            }
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