<template>
    <div class="main">
        <div class="topSearch">
            <h2>空号检测记录</h2>
            <el-form :inline="true">
                <el-form-item label="创建时间：">
                    <el-date-picker
                        :clearable="false"
                        v-model="searchData.time"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="datePickOption"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="代理商：" v-if="isAdmin">
                    <el-select v-model="searchData.agentId" placeholder="请选择代理商">
                        <el-option label="全部" :value="-1"></el-option>
                        <el-option v-for="(item, index) in agentList" :label="item.companyName" :key="index" :value="item.id + ''"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户名称：">
                    <el-input v-model="searchData.customerName" placeholder="客户名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号码：">
                    <el-input v-model="searchData.phone" placeholder="手机号码" clearable></el-input>
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
                <template v-if="isAdmin">
                    <el-table-column width="150" prop="agentName" label="代理商名称" align="center">
                    </el-table-column>
                    <el-table-column min-width="150" prop="customerName" label="客户名称" align="center">
                    </el-table-column>
                    <el-table-column min-width="150" prop="phone" label="手机号码" align="center">
                    </el-table-column>
                    <el-table-column min-width="150" prop="name" label="文件名称" align="center">
                    </el-table-column>
                    <el-table-column width="120" prop="size" label="文件大小" align="center">
                        <template slot-scope="scope">
                            <span>{{ computeFileSize(scope.row.size) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="totalNumber" label="总条数" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.totalNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="realNumber" label="实号包（条）" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.realNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="silentNumber" label="沉默包（条）" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.silentNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="emptyNumber" label="空号包（条）" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.emptyNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="riskNumber" label="风险包（条）" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.riskNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" prop="createTime" label="检测时间" align="center">
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column min-width="150" prop="customerName" label="客户名称" align="center">
                    </el-table-column>
                    <el-table-column min-width="150" prop="phone" label="手机号码" align="center">
                    </el-table-column>
                    <el-table-column min-width="120" prop="totalNumber" label="消耗条数" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.totalNumber || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150" prop="createTime" label="检测时间" align="center">
                    </el-table-column>
                </template>
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
    import { computeFileSize, formatDate } from '@/utils'
    export default {
        data() {
            return {
                computeFileSize,
                dataListLoading: false,
                searchData: {
                    time: undefined,
                    agentId: -1,
                    customerName: '',
                    phone: ''
                },
                totalInfo: {},
                tableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                agentList: [],
                isAdmin: Boolean(sessionStorage.getItem("msjRoleName") === "1")
            }
        },
        computed: {
            datePickOption () {
                return {
                    disabledDate(time) {
                        let nowDate = Date.now()
                        return time.getTime() > nowDate - 8.64e6
                    }
                }
            }
        },
        activated() {
            let currDate = formatDate(new Date())
            this.searchData = {
                time: currDate,
                agentId: -1,
                customerName: '',
                phone: ''
            }
            this.getTableData(1)
            this.isAdmin && this.getAgentList()
        },
        methods: {
            getTableData(cur) {
                this.pageIndex = cur || this.pageIndex;
                this.dataListLoading = true
                let agentId = this.searchData.agentId === -1 ? undefined : this.searchData.agentId
                this.$http({
                    url: this.$http.adornUrl(`agent/empty/getPageList`),
                    method: 'post',
                    data: {
                        'token': this.$cookie.get('token'),
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'createTimeFrom': this.searchData.time,
                        'createTimeEnd': this.searchData.time,
                        'phone': this.searchData.phone || undefined,
                        'customerName': this.searchData.customerName || undefined,
                        'agentId': this.isAdmin ? agentId : undefined,
                    }
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.tableData = data.data.list
                        this.totalPage = data.data.total
                        this.totalInfo = data.data.totalInfo || {}
                    } else {
                        this.tableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            getAgentList() {
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/listAgent?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
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
                if (rowIndex ===0) {
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
                    if (column.property === 'totalNumber') {
                        sums[index] = `共${this.totalInfo.totalSize}条`
                    } else {
                        sums[index] = '';
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