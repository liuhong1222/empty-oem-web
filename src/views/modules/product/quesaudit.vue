<template>
    <div class="main quesAudit">
        <div class="topSearch">
            <h2>常见问题审核列表</h2>
            <el-form :inline="true" :model="quesAuditForm" label-width="100px">
                <el-form-item label="状态">
                    <el-select v-model="quesAuditForm.status" placeholder="请选择状态">
                        <el-option v-for="item in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="quesAuditForm.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="item in auditStatusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索类型" class="searchType">
                    <el-select v-model="quesAuditForm.searchType" placeholder="请选择">
                        <el-option v-for="item in searchKeyArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-model="quesAuditForm.searchKey"></el-input>
                </el-form-item>
                <el-form-item label="选择日期：">
                    <el-date-picker v-model="quesAuditForm.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="getQuesAuditData(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="proTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column prop="id" label="问题ID" align="center" width="110">
                    <template slot-scope="{ row }">
                        <span>{{ row.id + '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="agentName" label="代理商名称" align="center" width="110">
                </el-table-column>
                <el-table-column prop="productName" label="所属产品" align="center">
                </el-table-column>
                <el-table-column prop="title" label="标题" align="center">
                </el-table-column>
                <el-table-column prop="state" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="提交时间" align="center">
                </el-table-column>
                <el-table-column prop="updateTime" label="审核时间" align="center">
                </el-table-column>
                <el-table-column prop="applyState" label="审核状态" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="quesAuditBtn(scope.row.id,'audit')" :disabled="(scope.row.applyState || '').indexOf('待审核') != -1 ? false : true">审核</el-button>
                        <el-button type="text" size="small" @click="quesAuditBtn(scope.row.id,'see')" :disabled="(scope.row.applyState || '').indexOf('待审核') != -1 ? true : false">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination :key="pageIndex" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 常见问题审核 -->
        <ques-audit-dialog v-if="quesAuditVisible" ref="quesAuditRef" @refreshNewsList="getQuesAuditData"></ques-audit-dialog>
    </div>
</template>

<script>
    import quesAuditDialog from './ques-audit-opera'
    export default {
        data() {
            return {
                quesAuditVisible: false,
                dataListLoading: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                quesAuditForm: {
                    status: '',
                    auditStatus: '',  //默认显示待审核
                    dateTime: '',
                    searchType: '',
                    searchKey: ''
                },
                searchKeyArr: [
                    { label: '全部', value: "" },
                    { label: '标题', value: "title" },
                    { label: '内容', value: "content" }
                ],
                statusArr: [
                    { label: '全部', value: "" },
                    { label: '上架', value: 1 },
                    { label: '下架', value: 0 }
                ],
                auditStatusArr: [
                    { label: '全部', value: '' },
                    { label: '创建待审核', value: 1 },
                    { label: '修改待审核', value: 2 },
                    { label: '已审核', value: 3 },
                    { label: '已驳回', value: 4 },
                    { label: '已删除', value: 5 }
                ],
                proTableData: []
            }
        },
        components: {
            quesAuditDialog
        },
        activated() {
            this.getQuesAuditData(1)
        },
        methods: {
            getQuesAuditData(cur) {
                this.dataListLoading = true;
                this.pageIndex = cur || this.pageIndex
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/all/list?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'queryType': this.quesAuditForm.searchType,
                        'content': this.quesAuditForm.searchKey,
                        'state': this.quesAuditForm.status,
                        'applyState': this.quesAuditForm.auditStatus,
                        'startTime': '' || this.quesAuditForm.dateTime == null ? '' : this.quesAuditForm.dateTime[0],
                        'endTime': '' || this.quesAuditForm.dateTime == null ? '' : this.quesAuditForm.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.proTableData = data.data.list
                        this.totalPage = data.data.total

                    } else {
                        this.proTableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            quesAuditBtn(id, stu) {
                this.quesAuditVisible = true,
                this.$nextTick(() => {
                    this.$refs.quesAuditRef.showInit(id, stu)
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getQuesAuditData()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getQuesAuditData()
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

    .searchType .el-input {
        width: 55%;
        margin-left: -99px;
    }

    .searchType .el-select .el-input {
        width: 45%;
        margin-left: 0px;
    }
</style>