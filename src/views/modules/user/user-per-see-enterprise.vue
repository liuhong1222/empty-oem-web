<template>
    <div class="seecuslog">
        <!-- 客户详情信息 -->
        <el-dialog title="查看客户" :visible.sync="dialogVisible" width="800px">
            <table class="discribe-wrapper" border>
                <tbody>
                    <template v-if="isCompany">
                        <tr class="discribe-row">
                            <td class="discribe-col title">联系人姓名</td>
                            <td class="discribe-col">{{ detailInfo.name }}</td>
                            <td class="discribe-col title">联系人手机号码</td>
                            <td class="discribe-col">{{ detailInfo.phone }}</td>
                        </tr>
                        <tr class="discribe-row">
                            <td class="discribe-col title">联系人邮箱</td>
                            <td class="discribe-col">{{ detailInfo.email }}</td>
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
                            <td class="discribe-col">
                                <div>{{ detailInfo.businessLicenseNumber }}</div>
                            </td>
                        </tr>
                        <tr class="discribe-row">
                            <td class="discribe-col title">企业法人姓名</td>
                            <td class="discribe-col">{{ detailInfo.legalPerson }}</td>
                            <td class="discribe-col title">营业期限</td>
                            <td class="discribe-col">{{ detailInfo.businessLicenseExpireStartTime }} - {{ detailInfo.businessLicenseExpireEndTime }}</td>
                        </tr>
                        <tr class="discribe-row">
                            <td class="discribe-col title">经营范围</td>
                            <td class="discribe-col">{{ detailInfo.businessScope }}</td>
                            <td class="discribe-col title">空号检测等级名称</td>
                            <td class="discribe-col">{{ detailInfo.agentLevel }}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr class="discribe-row">
                            <td class="discribe-col title">客户姓名</td>
                            <td class="discribe-col">{{ detailInfo.name }}</td>
                            <td class="discribe-col title">身份证号码</td>
                            <td class="discribe-col">{{ detailInfo.idCardNumber }}</td>
                        </tr>
                        <tr class="discribe-row">
                            <td class="discribe-col title">身份证照片正面</td>
                            <td class="discribe-col">
                                <img style="width: 200px;" v-if="detailInfo.idCardFrontPath" :src="$imgPreStr + detailInfo.idCardFrontPath">
                            </td>
                            <td class="discribe-col title">身份证照片背面</td>
                            <td class="discribe-col">
                                <img style="width: 200px;" v-if="detailInfo.idCardBackPath" :src="$imgPreStr + detailInfo.idCardBackPath">
                            </td>
                        </tr>
                        <tr class="discribe-row">
                            <td class="discribe-col title">详细地址</td>
                            <td class="discribe-col">{{ detailInfo.idCardAddress }}</td>
                            <td class="discribe-col title">证件期限</td>
                            <td class="discribe-col">{{ detailInfo.idCardExpireStartTime }} - {{ detailInfo.idCardExpireEndTime }}</td>
                        </tr>
                        <tr class="discribe-row">
                            <td class="discribe-col title">联系邮箱</td>
                            <td class="discribe-col">{{ detailInfo.email }}</td>
                            <td class="discribe-col title">空号检测等级名称</td>
                            <td class="discribe-col">{{ detailInfo.agentLevel }}</td>
                        </tr>
                    </template>
                    <tr class="discribe-row">
                        <td class="discribe-col title">单价</td>
                        <td class="discribe-col">{{ detailInfo.price ? detailInfo.price + '（元/条）' : '' }}</td>
                        <td class="discribe-col title">预警条数</td>
                        <td class="discribe-col">{{ detailInfo.warningsNumber }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">状态</td>
                        <td class="discribe-col">{{ stateMap[detailInfo.state] }}</td>
                        <td class="discribe-col title">备注</td>
                        <td class="discribe-col">{{ detailInfo.remark }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">版本</td>
                        <td class="discribe-col">{{ detailInfo.version }}</td>
                        <td class="discribe-col title">创建时间</td>
                        <td class="discribe-col">{{ detailInfo.createTime }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">修改时间</td>
                        <td class="discribe-col">{{ detailInfo.updateTime }}</td>
                        <td class="discribe-col title">IP地址</td>
                        <td class="discribe-col">{{ detailInfo.ip }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">区域</td>
                        <td class="discribe-col">{{ detailInfo.area }}</td>
                        <td class="discribe-col title">运营商</td>
                        <td class="discribe-col">{{ detailInfo.operator }}</td>
                    </tr>
                    <tr>
                        <td class="discribe-col title">来源</td>
                        <td class="discribe-col" colspan="3" style="width: 75%;">
                            <div style="width: 500px;">{{ detailInfo.referer }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import imgUrl from '@/utils/imgUrl'
   
    export default {
        data() {
            return {
                dialogVisible: false,
                detailInfo: {},
                isCompany: true,
                stateMap: {
                    '0': '待审核',
                    '9': '已认证',
                    '1': '已驳回'
                },
            }
        },
        methods: {
            init(record) {
                this.dialogVisible = true
                this.isCompany = Boolean(record.customerType === '企业');
                this.detailInfo = {};
                this.$http({
                    url: this.$http.adornUrl(`agent/cust/findPersonById?token=${this.$cookie.get('token')}&customerId=${record.customerId}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.detailInfo = data.data || {}
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
        }
    }

</script>
<style>
    .seecuslog .el-input__inner,
    .seecuslog .el-textarea__inner {
        border: none;
    }

    #avatar-uploaderFceImg .el-upload ,#avatar-uploaderpriseImg .el-upload{
        width: 150px;
        height: 110px;
    }

    #avatar-uploaderFceImg .el-upload img , #avatar-uploaderpriseImg  .el-upload img{
        width: 100%;
        height: 100%;
    }
</style>