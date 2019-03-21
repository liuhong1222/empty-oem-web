<template>
    <div class="main">
        <div class="topSearch">
            <h2>产品审核列表</h2>
            <el-form :inline="true" :model="proForm" label-width="100px">
                <el-form-item label="状态" style="margin-left: -60px">
                    <el-select v-model="proForm.status" placeholder="请选择状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="proForm.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in auditStatusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择日期：">
                    <el-date-picker v-model="proForm.dateTime" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="yyyy-MM-dd">
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
                <el-table-column prop="id" label="产品ID" align="center" width="110">
                </el-table-column>
                <el-table-column prop="agentName" label="代理商名称" align="center" width="110">
                </el-table-column>
                <el-table-column prop="proLineName" label="产品线名称" align="center">
                </el-table-column>
                <el-table-column prop="proName" label="产品名称" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="methods" label="跳转方式" align="center">
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
                        <el-button type="text" size="small" @click="proAuditBtn(scope.row.id)">审核</el-button>
                        <el-button type="text" size="small" @click="proAuditBtn(scope.row.id)">查看</el-button>
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
        <pro-audit v-if="proAuditVisible" ref="proAuditRef" @refreshNewsList="getProData"></pro-audit>
    </div>
</template>

<script>
    import proAudit from './pro-audit-opera'
    export default {
        data() {
            return {
                proAuditVisible: false,
                dataListLoading: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 100,
                proForm: {
                    auditStatus: '待审核',  //默认显示待审核
                    dateTime: ''
                },
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
                    { id: '1', agentName: '代理商名称', proLineName: '产品线名称', proName: '产品名称', status: '上架', methods: '内部编辑', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proLineName: '产品线名称', proName: '产品名称', status: '上架', methods: '内部编辑', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proLineName: '产品线名称', proName: '产品名称', status: '上架', methods: '内部编辑', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proLineName: '产品线名称', proName: '产品名称', status: '上架', methods: '内部编辑', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proLineName: '产品线名称', proName: '产品名称', status: '上架', methods: '内部编辑', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proLineName: '产品线名称', proName: '产品名称', status: '上架', methods: '内部编辑', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proLineName: '产品线名称', proName: '产品名称', status: '上架', methods: '内部编辑', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1', agentName: '代理商名称', proLineName: '产品线名称', proName: '产品名称', status: '上架', methods: '内部编辑', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' }
                ]
            }
        },
        components: {
            proAudit
        },
        activated() {
            this.getProData()
        },
        methods: {
            getProData() {
                this.dataListLoading = false;
            },
            proAuditBtn(id) {
                this.proAuditVisible = true;
                this.$nextTick(() => {
                    this.$refs.proAuditRef.showInit(id)
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getProData()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getProData()
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