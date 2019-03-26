<template>
    <div class="main quesAudit">
        <div class="topSearch">
            <h2>常见问题管理列表</h2>
            <el-form :inline="true" :model="quesDataForm" label-width="100px">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus">添加问题</el-button>
                </el-form-item>
                <el-form-item label="状态" style="margin-left: -40px">
                    <el-select v-model="quesDataForm.status" placeholder="请选择状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" style="margin-left: -60px;">
                    <el-select v-model="quesDataForm.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in auditStatusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索类型" style="margin-left: -60px;" class="searchType">
                    <el-select v-model="quesDataForm.searchType" placeholder="请选择">
                        <el-option v-for="(item,index) in searchKeyArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-model="quesDataForm.searchKey"></el-input>
                </el-form-item>
                <el-form-item label="选择日期：">
                    <el-date-picker v-model="quesDataForm.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="getQuesData(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="quesTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column prop="id" label="问题ID" align="center" width="110">
                </el-table-column>
                <el-table-column prop="proName" label="产品名称" align="center" width="110">
                </el-table-column>
                <el-table-column prop="title" label="标题" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="submitTime" label="修改时间" align="center">
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center">
                </el-table-column>
                <el-table-column prop="audit" label="审核状态" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="update(scope.row)">编辑</el-button>
                        <el-button type="text" size="small">下架</el-button>
                        <el-button type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 添加/编辑产品线 -->
        <add-question-update v-if="addquestionUpdateVisible" ref="addquestionUpdateRef" @refreshNewsList="getQuesData"></add-question-update>
    </div>
</template>

<script>
    import addQuestionUpdate from './add-question-update-manage'
    export default {
        data() {
            return {
                addquestionUpdateVisible: false,
                dataListLoading: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 100,
                quesDataForm: {
                    status: '',
                    auditStatus: '1',  //默认显示待审核
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
                quesTableData: [
                    { id: '1', proName: '产品名称', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', proName: '产品名称', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', proName: '产品名称', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', proName: '产品名称', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', proName: '产品名称', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', proName: '产品名称', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', proName: '产品名称', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', proName: '产品名称', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', proName: '产品名称', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', proName: '产品名称', title: '标题', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' }

                ]
            }
        },
        components: {
            addQuestionUpdate
        },
        created() {
            //         // 设置默认值
            if (this.quesDataForm.auditStatus == 1) {
                this.quesDataForm.auditStatus = '待审核'
            }
        },
        activated() {
            this.getQuesData()
        },

        methods: {
            getQuesData(cur) {
                let auditStatus = this.quesDataForm.auditStatus;
                auditStatus == '待审核' ? (auditStatus = 1) : (auditStatus = auditStatus);
                this.dataListLoading = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/all/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': cur || this.pageIndex,
                        'pageSize': this.pageSize,
                        'queryType': this.quesDataForm.searchType,
                        'content': this.quesDataForm.searchKey,
                        'status': this.quesDataForm.status,
                        'auditState': auditStatus,
                        'startDate': '' || this.quesDataForm.dateTime == null ? '' : this.quesDataForm.dateTime[0],
                        'endDate': '' || this.quesDataForm.dateTime == null ? '' : this.quesDataForm.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataListLoading = true;
                        if (cur == 1) {
                            this.pageIndex = 1
                        }
                        // this.proLineTableData = data.data.list
                        this.totalPage = data.data.total

                    } else {
                        // this.newsTableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            update(id) {
                this.addquestionUpdateVisible = true;
                this.$nextTick(() => {
                    this.$refs.addquestionUpdateRef.showInit(id)
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getQuesData()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getQuesData()
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