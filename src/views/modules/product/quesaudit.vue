<template>
    <div class="main quesAudit">
        <div class="topSearch">
            <h2>常见问题审核列表</h2>
            <el-form :inline="true" :model="quesAuditForm" label-width="100px">
                <el-form-item label="状态" style="margin-left: -60px">
                    <el-select v-model="quesAuditForm.status" placeholder="请选择状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" style="margin-left: -60px;">
                    <el-select v-model="quesAuditForm.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in auditStatusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索类型" style="margin-left: -60px;" class="searchType">
                    <el-select v-model="quesAuditForm.searchType" placeholder="请选择">
                        <el-option v-for="(item,index) in searchKeyArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-model="quesAuditForm.searchKey"></el-input>
                </el-form-item>
                <el-form-item label="选择日期：">
                    <el-date-picker v-model="quesAuditForm.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="proTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column prop="id" label="问题ID" align="center" width="110">
                </el-table-column>
                <el-table-column prop="agentName" label="代理商名称" align="center" width="110">
                </el-table-column>
                <el-table-column prop="proName" label="所属产品" align="center">
                </el-table-column>
                <el-table-column prop="title" label="标题" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="submitTime" label="提交时间" align="center">
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center">
                </el-table-column>
                <el-table-column prop="audit" label="审核状态" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="quesAuditBtn(scope.row.id)">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
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
                totalPage: 100,
                quesAuditForm: {
                    auditStatus: '待审核',  //默认显示待审核
                    dateTime: '',
                    searchType: '',
                    searchKey: ''
                },
                searchKeyArr: [
                    { label: '全部', value: 0 },
                    { label: '标题', value: 1 },
                    { label: '内容', value: 2 }
                ],
                statusArr: [
                    { label: '全部', value: 0 },
                    { label: '上架', value: 1 },
                    { label: '下架', value: 2 }
                ],
                auditStatusArr: [
                    { label: '全部', value: 0 },
                    { label: '待审核', value: 1 },
                    { label: '已审核', value: 2 },
                    { label: '驳回', value: 3 }
                ],
                proTableData: [
                    { id: '1', agentName: '代理商名称', proName: '所属产品', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proName: '所属产品', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proName: '所属产品', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proName: '所属产品', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proName: '所属产品', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proName: '所属产品', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proName: '所属产品', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proName: '所属产品', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proName: '所属产品', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' }
                ]
            }
        },
        components: {
            quesAuditDialog
        },
        activated() {
            this.getQuesAuditData()
        },
        methods: {
            getQuesAuditData() {
                this.dataListLoading = false;
            },
            quesAuditBtn(id) {
                this.quesAuditVisible = true,
                    this.$nextTick(() => {
                        this.$refs.quesAuditRef.showInit(id)
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