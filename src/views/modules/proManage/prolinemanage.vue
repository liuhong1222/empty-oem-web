<template>
    <div class="main">
        <div class="topSearch">
            <h2>产品线管理列表</h2>
            <el-form :inline="true" :model="proLineForm" label-width="100px">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="update()">添加产品线</el-button>
                </el-form-item>
                <el-form-item label="选择日期：">
                    <el-date-picker v-model="proLineForm.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态" style="margin-left: -35px">
                    <el-select v-model="proLineForm.status" placeholder="请选择状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" style="margin-left: -35px">
                    <el-select v-model="proLineForm.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in auditStatusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="proLineTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column prop="id" label="产品线ID" align="center" width="110">
                </el-table-column>
                <el-table-column prop="proLineName" label="产品线名称" align="center">
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
        <add-proline-update v-if="addProlineUpdateVisible" ref="addProlineUpdateRef" @refreshNewsList="getProLineData"></add-proline-update>
    </div>
</template>
<script>
    import addProlineUpdate from './add-proline-update-manage'
    export default {
        data() {
            return {
                addProlineUpdateVisible: false,
                dataListLoading: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 100,
                proLineForm: {
                    status: '',
                    auditStatus: '',
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
                proLineTableData: [
                    { id: '1602', proLineName: '产品线名称', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1602', proLineName: '产品线名称', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1602', proLineName: '产品线名称', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1602', proLineName: '产品线名称', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1602', proLineName: '产品线名称', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1602', proLineName: '产品线名称', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1602', proLineName: '产品线名称', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1602', proLineName: '产品线名称', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' },
                    { id: '1602', proLineName: '产品线名称', status: '上架', submitTime: '时间', sort: '1', audit: '已审核', remark: '备注,,.....' }

                ]
            }
        },
        components: {
            addProlineUpdate
        },
        activated() {
            this.getProLineData()
        },
        methods: {
            getProLineData() {
                this.dataListLoading = false;
            },
            update(id) {
                this.addProlineUpdateVisible = true;
                this.$nextTick(() => {
                    this.$refs.addProlineUpdateRef.showInit(id)
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