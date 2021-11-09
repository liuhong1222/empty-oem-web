<template>
    <div>
        <div class="topSearch">
            <h3>我的新闻列表</h3>
            <el-form :inline="true" :model="newsSearchData">
                <el-form-item label="选择状态：">
                    <el-select v-model="newsSearchData.type" placeholder="选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="发布待审核" value="1"></el-option>
                        <el-option label="修改待审核" value="2"></el-option>
                        <el-option label="已审核" value="3"></el-option>
                        <el-option label="已驳回" value="4"></el-option>
                        <el-option label="已删除" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="newsTableDataList(1)">查询</el-button>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="updateList()">发布新闻</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="newsTableData" style="width: 100%" :header-cell-style="getRowClass" v-loading="dataListLoading">
                <el-table-column type="index" header-align="center" align="center" width="80" label="序号">
                </el-table-column>
                <!-- <el-table-column prop="agentName" label="代理商名称" align="center">
                </el-table-column> -->
                <el-table-column prop="title" label="新闻标题" align="center">
                </el-table-column>
                <el-table-column prop="commitTime" width="150" label="发布时间" align="center">
                </el-table-column>
                <el-table-column prop="auditStateName" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="auditRemark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="seeList(scope.row.id)">查看</el-button>
                        <el-button type="text" size="small" @click="updateList(scope.row.id)" :disabled="scope.row.auditState == 5 ? true : false">修改</el-button>
                        <el-button type="text" size="small" @click="delList(scope.row)" :disabled="scope.row.auditState == 5 ? true : false">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 修改,发布 -->
        <release-or-update v-if="releaseUpdateVisible" ref="releaseOrUpdate" @refreshNewsList="newsTableDataList"></release-or-update>
        <!--查看-->
        <see-or-dialog v-if="seeOrDialogVisible" ref="seeOrDialog"></see-or-dialog>
    </div>
</template>
<script>
    import ReleaseOrUpdate from './new-release-or-update'
    import seeOrDialog from './new-see-or-dialog'
    export default {
        data() {
            return {
                newsSearchData: {
                    type: ''
                },
                newsTableData: [],
                releaseUpdateVisible: false,
                seeOrDialogVisible: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false
            }
        },
        components: {
            ReleaseOrUpdate,
            seeOrDialog
        },
        activated() {
            this.newsTableDataList(1)
        },
        methods: {
            newsTableDataList(curr) {
                this.dataListLoading = true
                this.pageIndex = curr || this.pageIndex
                this.$http({
                    url: this.$http.adornUrl(`agent/news/all/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'auditState': this.newsSearchData.type
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.newsTableData = data.data.list
                        this.totalPage = data.data.total

                    } else {
                        this.newsTableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.newsTableDataList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.newsTableDataList()
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
            },
            // 修改，发布
            updateList(id) {
                this.releaseUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.releaseOrUpdate.showInit(id)
                })
            },
            // 查看
            seeList(id) {
                this.seeOrDialogVisible = true
                this.$nextTick(() => {
                    this.$refs.seeOrDialog.showInit(id)
                })
            },
            delList(record) {
                this.$confirm(`是否删除【${record.title}】以及相关信息？`, '删除新闻列表', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`agent/news/my/delete?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'newsId': record.id + ''
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.newsTableDataList(1)
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