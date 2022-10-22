<template>
    <div id="seeAgent">
        <el-dialog title="查看代理商" :visible.sync="dialogVisible" width="800px">
            <table class="discribe-wrapper" border>
                <tbody>
                    <tr class="discribe-row">
                        <td class="discribe-col title">联系人姓名</td>
                        <td class="discribe-col">{{ detailInfo.linkmanName }}</td>
                        <td class="discribe-col title">联系人手机号码</td>
                        <td class="discribe-col">{{ detailInfo.linkmanPhone }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">联系人邮箱</td>
                        <td class="discribe-col">{{ detailInfo.linkmanEmail }}</td>
                        <td class="discribe-col title">营业执照</td>
                        <td class="discribe-col">
                            <img style="width: 200px;" v-if="detailInfo.businessLicensePath" :src="$imgPreStr + detailInfo.businessLicensePath">
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">公司名称</td>
                        <td class="discribe-col">{{ detailInfo.companyName }}</td>
                        <td class="discribe-col title">公司简称</td>
                        <td class="discribe-col">{{ detailInfo.companyShortName }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">营业执照所在地</td>
                        <td class="discribe-col">{{ detailInfo.businessLicenseAddress }}</td>
                        <td class="discribe-col title">营业执照号</td>
                        <td class="discribe-col">{{ detailInfo.businessLicenseNumber }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">企业法人姓名</td>
                        <td class="discribe-col">{{ detailInfo.legalPerson }}</td>
                        <td class="discribe-col title">营业执照有效期开始时间</td>
                        <td class="discribe-col">{{ detailInfo.businessLicenseExpireStartTime }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">营业执照有效期结束时间</td>
                        <td class="discribe-col">{{ detailInfo.businessLicenseExpireEndTime }}</td>
                        <td class="discribe-col title">状态</td>
                        <td class="discribe-col">{{ detailInfo.state ? '启用' : '禁用' }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">备注</td>
                        <td class="discribe-col">
                            <div>{{ detailInfo.remark }}</div>
                        </td>
                        <td class="discribe-col title">创建时间</td>
                        <td class="discribe-col">{{ detailInfo.createTime }}</td>
                    </tr>
                </tbody>
            </table>
            <el-table
                :data="tableData"
                :border="true"
                size="small"
                class="agent-detail-info-table"
                style="width: 100%;margin-top: 12px;"
                :header-cell-style="getRowClass"
            >
                <el-table-column min-width="120" prop="name" label="产品名称" align="center"></el-table-column>
                <el-table-column min-width="120" prop="level" label="代理等级名称" align="center"></el-table-column>
                <el-table-column min-width="120" prop="price" label="单价（元/条）" align="center"></el-table-column>
                <el-table-column min-width="120" prop="warningsNumber" label="预警条数" align="center"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                labelPosition: 'right',
                detailInfo: {},
                tableData: [],
            }
        },
        methods: {
            showInit(id) {
                this.dialogVisible = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/detail?token=${this.$cookie.get('token')}&agentId=${id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.detailInfo = data.data || {}
                        this.dealTableData(data.data || {})
                    }
                })
            },
            dealTableData(data) {
                this.tableData = [
                    { name: '空号检测', level: data.agentLevel, price: data.price, warningsNumber: data.warningsNumber, },
                    { name: '实时检测', level: data.realLevel, price: data.realPrice, warningsNumber: data.realWarningsNumber, },
                    { name: '国际检测', level: data.internationalLevel, price: data.internationalPrice, warningsNumber: data.internationalWarningsNumber, },
                    { name: '定向通用检测', level: data.directCommonLevel, price: data.directCommonPrice, warningsNumber: data.directCommonWarningsNumber, },
                    { name: 'line定向检测', level: data.lineDirectLevel, price: data.lineDirectPrice, warningsNumber: data.lineDirectWarningsNumber, },
                ]
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return "background-color: #f8f8f8;color:#666;";
                } else {
                    return "";
                }
            },
        }
    }

</script>
<style>
    #seeAgent .el-input__inner {
        border: none !important;
    }

    /* #priceCss .el-input {
        width: auto;
        border:1px solid red
    } */

    #avatar-uploaderImg .el-upload {
        width: 150px;
        height: 110px;
    }

    #avatar-uploaderImg .el-upload img {
        width: 100%;
        height: 100%;
    }
</style>
<style lang="scss">
.agent-detail-info-table {
    &.el-table .el-table__row:last-child td {
        border-bottom: 1px solid #ebeef5;
    }
}
</style>