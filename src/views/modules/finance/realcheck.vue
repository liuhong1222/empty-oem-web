<template>
    <div class="main">
        <div class="topSearch">
            <h2>实时检测记录</h2>
            <el-form :inline="true">
                <el-form-item label="创建时间：">
                    <el-date-picker v-model="searchData.createTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="代理商：" v-if="isAdmin">
                    <el-select v-model="searchData.agentId" placeholder="代理商">
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
                <el-table-column width="150" prop="agentName" v-if="isAdmin" label="代理商名称" align="center">
                </el-table-column>
                <el-table-column width="150" prop="phone" label=" 手机号码" align="center">
                </el-table-column>
                <el-table-column width="150" prop="name" label=" 文件名称" align="center">
                </el-table-column>
                <el-table-column width="120" prop="size" label="文件大小" align="center">
                    <template slot-scope="scope">
                        <span>{{ Math.round((scope.row.size || 0) / 1024) + 'KB' }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" prop="normal" label=" 正常" align="center">
                </el-table-column>
                <el-table-column width="120" prop="numberPortability" label=" 正常(携号转网)" align="center">
                </el-table-column>
                <el-table-column width="120" prop="empty" label=" 空号" align="center">
                </el-table-column>
                <el-table-column width="120" prop="onCall" label=" 通话中" align="center">
                </el-table-column>
                <el-table-column width="120" prop="onlineButNotAvailable" label=" 不在网(空号)" align="center">
                </el-table-column>
                <el-table-column width="120" prop="shutdown" label=" 关机" align="center">
                </el-table-column>
                <el-table-column width="120" prop="suspectedShutdown" label="疑似关机" align="center">
                </el-table-column>
                <el-table-column width="120" prop="serviceSuspended" label=" 停机" align="center">
                </el-table-column>
                <el-table-column width="120" prop="unknown" label=" 号码错误" align="center">
                </el-table-column>
                <el-table-column width="120" prop="exceptionFailCount" label=" 未知" align="center">
                </el-table-column>
                <el-table-column width="120" prop="illegalNumber" label=" 无效数" align="center">
                </el-table-column>
                <el-table-column width="120" prop="checkType" label=" 接口" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.checkType === 0 ? 'CL' : '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" prop="line" label="检测数" align="center">
                </el-table-column>
                <el-table-column width="150" prop="createTime" label="创建时间" align="center">
                </el-table-column>
                <el-table-column width="150" prop="updateTime" label="完成时间" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10,20,30,50]"
                :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                totalCount: 0,
                dataListLoading: false,
                searchData: {
                    createTime: [],
                    agentId: -1,
                    customerName: '',
                    phone: ''
                },
                tableData: [{ totalNumber: 1000, unknownNumber: 100, id: 1 }],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                agentList: [],
                isAdmin: Boolean(sessionStorage.getItem("msjRoleName") === "1")
            }
        },
        activated() {
            this.getTableData()
            this.isAdmin && this.getAgentList()
        },
        methods: {
            getTableData(cur) {
                this.pageIndex = cur || this.pageIndex;
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/realtimeCheck/getPageList`),
                    method: 'post',
                    data: {
                        'token': this.$cookie.get('token'),
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'createTimeFrom': this.searchData.createTime && this.searchData.createTime[0] ? this.searchData.createTime[0] : undefined,
                        'createTimeEnd': this.searchData.createTime && this.searchData.createTime[1] ? this.searchData.createTime[1] : undefined,
                        'phone': this.searchData.phone || undefined,
                        'customerName': this.searchData.customerName || undefined,
                        'agentId': this.searchData.agentId === -1 ? undefined : this.searchData.agentId,
                    }
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.tableData = data.data.list
                        this.totalPage = data.data.total
                        this.totalCount = data.data.totalInfo.totalSize
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
                    if (column.property === 'line') {
                        sums[index] = `共${this.totalCount}条`
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