<template>
    <div class="main">
        <div class="topSearch">
            <h2>产品线审核列表</h2>
            <el-form :inline="true" :model="proLineForm" label-width="100px">
                <el-form-item label="审核状态">
                    <el-select v-model="proLineForm.status" placeholder="请选择审核状态">
                        <el-option v-for="item in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择日期：">
                    <el-date-picker v-model="proLineForm.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="getProLineData(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="proLineTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column prop="agentName" label="代理商名称" align="center" width="110">
                </el-table-column>
                <el-table-column prop="name" label="产品线名称" align="center">
                </el-table-column>
                <el-table-column prop="create_time" label="提交时间" align="center">
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center">
                </el-table-column>
                <el-table-column prop="update_time" label="审核时间" align="center">
                </el-table-column>
                <el-table-column prop="applyState" label="审核状态" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="proLineAuditBtn(scope.row.id)" :disabled="(scope.row.applyState || '').indexOf('待审核') != -1 ? false : true">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>

        <!-- 产品线审核 -->
        <pro-line-audit v-if="proLineAuditVisible" ref="proLineAuditRef" @refreshNewsList="getProLineData"></pro-line-audit>
    </div>
</template>

<script>
    import proLineAudit from './pro-line-audit-opera'
    export default {
        data() {
            return {
                proLineAuditVisible: false,
                dataListLoading: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                proLineForm: {
                    status: '',  //默认显示待审核
                    dateTime: ''
                },
                statusArr: [
                    { label: '全部', value: '' },
                    { label: '创建待审核', value: 1 },
                    { label: '修改待审核', value: 2 },
                    { label: '已审核', value: 3 },
                    { label: '已驳回', value: 4 },
                    { label: '已删除', value: 5 }
                ],
                proLineTableData: []
            }
        },
        components: {
            proLineAudit
        },
        activated() {
            this.getProLineData(1)
        },
        methods: {
            getProLineData(cur) {
                this.dataListLoading = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/line/list?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'currentPage': cur || this.pageIndex,
                        'pageSize': this.pageSize,
                        'applyState': this.proLineForm.status,
                        'startTime': '' || this.proLineForm.dateTime == null ? '' : this.proLineForm.dateTime[0],
                        'endTime': '' || this.proLineForm.dateTime == null ? '' : this.proLineForm.dateTime[1]
                    })
                }).then(({ data }) => {
                    this.dataListLoading = false
                    if (data && data.code === 0) {
                        if (cur == 1) {
                            this.pageIndex = 1
                        }
                        this.proLineTableData = data.data.list || []
                        this.totalPage = data.data.total || 0
                    } else {
                        this.proLineTableData = []
                        this.totalPage = 0
                    }
                })
            },
            proLineAuditBtn(id) {
                this.proLineAuditVisible = true
                this.$nextTick(() => {
                    this.$refs.proLineAuditRef.showInit(id)
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getProLineData()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getProLineData()
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
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