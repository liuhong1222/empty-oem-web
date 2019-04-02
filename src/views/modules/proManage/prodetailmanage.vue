<template>
    <div class="main">
        <div class="topSearch">
            <h2>产品详情管理列表</h2>
            <el-form :inline="true" :model="proLineForm" label-width="100px">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="update()">添加产品</el-button>
                </el-form-item>
                <el-form-item label="产品线名称">
                    <el-select v-model="proLineForm.proLineName" placeholder="请选择产品线名称">
                        <el-option v-for="(item,index) in proLineNameArr" :label="item.productName" :key="item.id"
                            :value="item.id"></el-option>
                    </el-select>
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
                    <el-button type="primary" @click="getProData(1)">查询</el-button>
                    <el-button type="primary" @click="proSortReload()">刷新排序</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="proLineTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column prop="order_num" label="排序" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.order_num" @change="orderNumChange(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="product_type_id" label="产品线ID" align="center" width="110"> </el-table-column>
                <el-table-column prop="productLineName" label="产品线名称" align="center">
                </el-table-column>
                <el-table-column prop="product_name" label="产品名称" align="center">
                </el-table-column>
                <el-table-column prop="icon_path" label="icon图片" align="center">
                </el-table-column>
                <el-table-column prop="shelf_status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.shelf_status==0 ? '上架':'下架' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="jump_mode" label="跳转方式" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.jump_mode==1 ? '内部编辑':'外部地址' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="修改时间" align="center">
                </el-table-column>
                <el-table-column prop="auditStatus" label="审核状态" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="update(scope.row.id)" :disabled="(scope.row.auditStatus).indexOf('待审核') != -1 ? true : false">编辑</el-button>
                        <el-button type="text" size="small" @click="onOrOffBtn(scope.row)">{{scope.row.shelf_status==0
                            ? '下架':'上架' }}</el-button>
                        <el-button type="text" size="small" @click="delBtn(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 添加和编辑产品 -->
        <add-pro-update v-if="addProUpdateVisible" ref="addProUpdateRef" @refreshNewsList="getProData"></add-pro-update>
    </div>
</template>
<script>
    import addProUpdate from './add-pro-update-manage'
    export default {
        data() {
            return {
                addProUpdateVisible: false,
                dataListLoading: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 100,
                proLineForm: {
                    status: '',
                    auditStatus: '',
                    dateTime: '',
                    proLineName: ''
                },
                statusArr: [
                    { label: '全部', value: -1 },
                    { label: '上架', value: 0 },
                    { label: '下架', value: 1 }
                ],
                auditStatusArr: [
                    { label: '全部', value: -1 },
                    { label: '创建待审核', value: 0 },
                    { label: '已审核', value: 1 },
                    { label: '创建驳回', value: 2 },
                    { label: '修改待审核', value: 3 },
                    { label: '修改驳回', value: 4 }
                ],
                proLineTableData: [],
                proLineNameArr: []
            }
        },
        components: {
            addProUpdate
        },
        activated() {
            // if (this.proLineForm.auditStatus !== 0) {
            //     this.proLineForm.auditStatus = 0
            // }
            this.getProData();
            this.getproLineName();
        },
        // created() {
        //     // 设置默认值
        //     if (this.proLineForm.auditStatus == 0) {
        //         this.proLineForm.auditStatus = '待审核'
        //     }
        // },
        methods: {
            // 排序
            orderNumChange(row) {
                this.$http({
                    url: this.$http.adornUrl(`agent/product/updateOrder?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'orderNum': row.order_num,
                        'id': row.id
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.getProData()
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            getProData(cur) {
                this.dataListLoading = true;
                // let auditStatus = this.proLineForm.auditStatus;
                // auditStatus == '待审核' ? (auditStatus = 0) : auditStatus;
                this.$http({
                    url: this.$http.adornUrl(`agent/product/list?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'productLineId': this.proLineForm.proLineName,
                        'currentPage': cur || this.pageIndex,
                        'pageSize': this.pageSize,
                        'auditStatus': this.proLineForm.auditStatus,
                        'shelfStatus': this.proLineForm.status,
                        'startTime': '' || this.proLineForm.dateTime == null ? '' : this.proLineForm.dateTime[0],
                        'endTime': '' || this.proLineForm.dateTime == null ? '' : this.proLineForm.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataListLoading = false;
                        if (cur == 1) {
                            this.pageIndex = 1
                        }
                        this.proLineTableData = data.data.list
                        this.totalPage = data.data.total

                    } else {
                        this.proLineTableData = []
                        this.totalPage = 0
                    }
                })
            },
            getproLineName() {
                this.$http({
                    url: this.$http.adornUrl(`agent/line/findNameList?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({})
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        // console.log(data)
                        this.proLineNameArr = data.data;
                        this.proLineNameArr.unshift({ id: '', productName: "全部" })
                    } else {
                        this.proLineNameArr = [];
                        this.$message.error(data.msg);
                    }
                })
            },
            update(id) {
                this.addProUpdateVisible = true;
                this.$nextTick(() => {
                    this.$refs.addProUpdateRef.showInit(id)
                })
            },
            // 上架，下架
            onOrOffBtn(row) {
                let shelf_status = row.shelf_status;
                let id = row.id
                if (shelf_status == 0) {  //下架
                    // alert('下架')
                    this.onOffFun(1, id)
                } else if (shelf_status == 1) {  //上架
                    // alert('上架')
                    this.onOffFun(0, id)
                }
            },
            onOffFun(shelf_status, id) {
                this.$http({
                    url: this.$http.adornUrl(`agent/product/updateStatus?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'status': shelf_status,
                        'id': id
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (shelf_status == 0) {
                            this.$message.success('上架成功')
                        } else if (shelf_status == 1) {
                            this.$message.success('下架成功')
                        } else if (shelf_status == 2) {
                            this.$message.success('删除成功')
                        }
                        this.getProLineData()

                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            delBtn(id) {
                this.$confirm(`确定对此产品进行删除操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.onOffFun(2, id)
                }).catch(() => { })
            },
            proSortReload() {
                this.dataListLoading = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/my/againOrder?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataListLoading = false;
                        this.getQuesData();
                    } else {
                        this.$message.error(data.msg)
                    }
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