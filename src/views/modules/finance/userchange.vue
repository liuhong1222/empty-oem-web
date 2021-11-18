<template>
    <div class="main">
        <div class="topSearch">
            <h2>客户转代理商记录</h2>
            <el-form :inline="true" :model="transferSearchData" @keyup.enter.native="transferAgentList(1)">
                <el-form-item label="操作日期：">
                    <el-date-picker v-model="transferSearchData.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="客户手机号：" class="transferInput">
                    <el-input v-model="transferSearchData.mobile" placeholder="请输入客户手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="转出代理商名称：" class="transferInput">
                    <el-input v-model="transferSearchData.agentName" placeholder="请输入转出代理商名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="转入代理商名称：" class="transferInput">
                    <el-input v-model="transferSearchData.transferAgent" placeholder="请输入转入的代理商名称" clearable></el-input>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="transferAgentList(1)">查询</el-button>
                    <el-button type="primary" @click="exportAgent()" :disabled="disabled">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="transferTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column prop="phone" label="手机号码" align="center" width="110">
                </el-table-column>
                <el-table-column prop="name" label="客户名称" align="center">
                </el-table-column>
                <el-table-column prop="registerTime" label="注册时间" align="center">
                </el-table-column>
                <el-table-column prop="sourceCompanyName" label="转出代理商" align="center">
                </el-table-column>
                <el-table-column prop="destCompanyName" label="转入代理商" align="center">
                </el-table-column>
                <el-table-column prop="updateTime" label="操作时间" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center" width="250">
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination :key="pageIndex" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10,20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                transferSearchData: {
                    dateTime: '',
                    mobile: '',
                    agentName: '',
                    transferAgent: ''
                },
                disabled: false,
                transferTableData: [],
                dataListLoading: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                pickerOptions0: {   //当前之前日期
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                }
            }
        },
        activated() {
            this.transferAgentList(1)
        },
        methods: {
            // 转代理商列表
            transferAgentList(cur) {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/user/getPageList?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    data: {
                        'currentPage': cur || this.pageIndex,
                        'pageSize': this.pageSize,
                        'sourceAgentName': this.transferSearchData.agentName,
                        'destAgentName': this.transferSearchData.transferAgent,
                        'phone': this.transferSearchData.mobile,
                        'startTime': '' || this.transferSearchData.dateTime == null ? '' : this.transferSearchData.dateTime[0],
                        'endTime': '' || this.transferSearchData.dateTime == null ? '' : this.transferSearchData.dateTime[1]
                    }
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (cur == 1) {
                            this.pageIndex = 1
                        }
                        this.transferTableData = data.data.list
                        this.totalPage = data.data.total;
                        if (data.data.list.length == 0) {
                            this.disabled = true
                        } else {
                            this.disabled = false
                        }
                    } else {
                        this.transferTableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.transferAgentList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.transferAgentList()
            },
            exportAgent() {
                let startTime;
                let endTime;
                if (this.transferSearchData.dateTime == null) {
                    startTime = ""
                    endTime = ""
                } else {
                    if (this.transferSearchData.dateTime.length == 0) {
                        startTime = ""
                        endTime = ""
                    } else {
                        startTime = this.transferSearchData.dateTime[0]
                        endTime = this.transferSearchData.dateTime[1]
                    }
                }
                window.open(this.$http.adornUrl(`agent/user/export?token=${this.$cookie.get('token')}&currentPage=${this.pageIndex}&pageSize=${this.pageSize}&sourceAgentName=${this.transferSearchData.agentName}&destAgentName=${this.transferSearchData.transferAgent}&phone=${this.transferSearchData.mobile}&startTime=${startTime}&endTime=${endTime}`))

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

    .transferInput .el-input__inner {
        width: 185px
    }

    .transferInput .el-input__suffix {
        left: 150px;
    }
</style>