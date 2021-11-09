<template>
    <div>
        <div class="topSearch">
            <h3>代理商新闻列表</h3>
            <el-form :inline="true" :model="ADnewsSearchData" @keyup.enter.native="ADnewsTableDataList(1)">
                <el-form-item label="选择状态：">
                    <el-select v-model="ADnewsSearchData.type" placeholder="选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="发布待审核" value="1"></el-option>
                        <el-option label="修改待审核" value="2"></el-option>
                        <el-option label="已审核" value="3"></el-option>
                        <el-option label="已驳回" value="4"></el-option>
                        <el-option label="已删除" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="代理商名称">
                    <el-input v-model="ADnewsSearchData.agentName" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="ADnewsTableDataList(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="ADnewsTableData" style="width: 100%" :header-cell-style="getRowClass" v-loading="dataListLoading">
                <el-table-column type="index" header-align="center" align="center" width="80" label="序号">
                </el-table-column>
                <el-table-column prop="agentName" label="代理商名称" align="center">
                </el-table-column>
                <el-table-column prop="title" label="新闻标题" align="center">
                </el-table-column>
                <el-table-column prop="commitTime" width="150" label="提交时间" align="center">
                </el-table-column>
                <el-table-column prop="auditTime" width="150" label="审核时间" align="center">
                </el-table-column>
                <el-table-column prop="auditStateName" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="auditRemark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="auditNes(scope.row.id,'see')">查看</el-button>
                        <el-button type="text" size="small" @click="delADnewsList(scope.row)" :disabled="scope.row.auditState == 5 ? true : false">删除</el-button>
                        <el-button type="text" size="small" @click="auditNes(scope.row.id,'audit')" :disabled="['1', '2'].includes(scope.row.auditState + '') ? false : true">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 查看，审核页面 -->
        <audit-or-new v-if="auditOrNewVisible" ref="AuditOrNewRef" @auditRefreshDataList="ADnewsTableDataList"></audit-or-new>
    </div>
</template>
<script>
    import AuditOrNew from './audit-or-new'
    export default {
        data() {
            return {
                dataListLoading: false,
                auditOrNewVisible: false,
                ADnewsSearchData: {
                    type: '',
                    agentName: ''
                },
                ADnewsTableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
            }
        },
        components: {
            AuditOrNew
        },
        activated() {
            this.ADnewsTableDataList(1)
        },
        methods: {
            ADnewsTableDataList(curr) {
                this.dataListLoading = true
                this.pageIndex = curr || this.pageIndex
                this.$http({
                    url: this.$http.adornUrl(`agent/news/all/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'auditState': this.ADnewsSearchData.type,
                        'agentName': this.ADnewsSearchData.agentName
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.ADnewsTableData = data.data.list
                        this.totalPage = data.data.total

                    } else {
                        this.ADnewsTableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 删除
            delADnewsList(record) {
                this.$confirm(`是否删除【${record.title}】以及相关信息？`, '删除新闻列表', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`agent/news/all/delete?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'newsId': record.id + ''
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.ADnewsTableDataList(1)
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }).catch(() => { })
            },
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.ADnewsTableDataList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.ADnewsTableDataList()
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
            },
            auditNes(id, type) {
                this.auditOrNewVisible = true
                this.$nextTick(() => {
                    this.$refs.AuditOrNewRef.auditShowInit(id, type)
                })
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