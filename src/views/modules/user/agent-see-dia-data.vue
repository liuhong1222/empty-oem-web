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
                        <td class="discribe-col title">空号检测等级名称</td>
                        <td class="discribe-col">{{ detailInfo.agentLevel }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">空号检测单价</td>
                        <td class="discribe-col">{{ detailInfo.price }}（元/条）</td>
                        <td class="discribe-col title">空号检测预警条数</td>
                        <td class="discribe-col">{{ detailInfo.warningsNumber }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">实时检测等级名称</td>
                        <td class="discribe-col">{{ detailInfo.realLevel }}</td>
                        <td class="discribe-col title">实时检测单价</td>
                        <td class="discribe-col">{{ detailInfo.realPrice }}（元/条）</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">实时检测预警条数</td>
                        <td class="discribe-col">{{ detailInfo.realWarningsNumber }}</td>
                        <td class="discribe-col title">国际检测等级名称</td>
                        <td class="discribe-col">{{ detailInfo.internationalLevel }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">国际检测单价</td>
                        <td class="discribe-col">{{ detailInfo.internationalPrice }}（元/条）</td>
                        <td class="discribe-col title">国际检测预警条数</td>
                        <td class="discribe-col">{{ detailInfo.internationalWarningsNumber }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">状态</td>
                        <td class="discribe-col">{{ detailInfo.state ? '启用' : '禁用' }}</td>
                        <td class="discribe-col title">备注</td>
                        <td class="discribe-col">
                            <div>{{ detailInfo.remark }}</div>
                        </td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">创建时间</td>
                        <td class="discribe-col span-3" colspan="3">{{ detailInfo.createTime }}</td>
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
                labelPosition: 'right',
                seeImageUrl: '',
                detailInfo: {},
                dataForm: {
                    id: 0,
                    // agentNumber: '',
                    businNumber: '',
                    companyName: '',
                    bussicAdress: '',
                    lawName: '',
                    businNum: '',
                    busindate1: '',
                    busindate2: '',
                    username: '',
                    mobile: '',
                    email: '',
                    work: '',
                    loginAcc: '',
                    pwd: '',
                    agencylevel: '',  //级别
                    price: '',
                    allowCounts: '',
                    shortName: ''
                },
            }
        },
        methods: {
            showInit(id) {
                this.dialogVisible = true;
                this.dataForm.id = id
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/detail?token=${this.$cookie.get('token')}&agentId=${id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.detailInfo = data.data || {}
                        this.seeImageUrl = imgUrl.imgUrl + data.data.licenseUrl
                        // this.dataForm.agentNumber = data.data.agentNo
                        this.dataForm.businNumber = data.data.mchId
                        this.dataForm.companyName = data.data.companyName
                        this.dataForm.shortName = data.data.shortName
                        this.dataForm.bussicAdress = data.data.address
                        this.dataForm.lawName = data.data.legalPerson
                        this.dataForm.businNum = data.data.licenseNo
                        this.dataForm.busindate1 = data.data.effectDate
                        this.dataForm.busindate2 = data.data.expireDate
                        this.dataForm.username = data.data.contactName
                        this.dataForm.mobile = data.data.mobile
                        this.dataForm.email = data.data.email
                        this.dataForm.work = data.data.position
                        this.dataForm.loginAcc = data.data.mobile
                        this.dataForm.agencylevel = data.data.levelId
                        this.dataForm.price = data.data.price
                        this.dataForm.allowCounts = data.data.emptyWarnNumber
                    }
                })
            }
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