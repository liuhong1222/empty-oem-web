<template>
    <div id="seeAgent">
        <el-dialog title="查看代理商" :visible.sync="dialogVisible" width="60%">
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
                        <td class="discribe-col title">营业执照地址</td>
                        <td class="discribe-col">
                            {{ detailInfo.businessLicensePath }}
                            <!-- <img v-if="seeImageUrl" :src="seeImageUrl" class="avatar"> -->
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
                        <td class="discribe-col title">单价</td>
                        <td class="discribe-col">{{ detailInfo.price }}（元/条）</td>
                        <td class="discribe-col title">预警条数</td>
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
                        <td class="discribe-col title">状态</td>
                        <td class="discribe-col">{{ detailInfo.state ? '启用中' : '禁用中' }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">备注</td>
                        <td class="discribe-col">{{ detailInfo.remark }}</td>
                        <td class="discribe-col title">创建时间</td>
                        <td class="discribe-col">{{ detailInfo.createTime }}</td>
                    </tr>
                </tbody>
            </table>
            <el-form v-show="false" :model="dataForm" ref="dataForm" label-width="150px" class="demo-ruleForm" :label-position="labelPosition">
                <!-- <h3>基本信息</h3> -->
                <!-- <el-form-item label="代理商编号：" prop="agentNumber">
                    <el-input v-model="dataForm.agentNumber" placeholder="代理商编号" readonly></el-input>
                </el-form-item> -->
                <el-form-item label="营业执照：" id="avatar-uploaderImg">
                    <el-upload class="avatar-uploader" action="" :show-file-list="false" disabled>
                        <img v-if="seeImageUrl" :src="seeImageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="商户编号：">
                    <el-input v-model="dataForm.businNumber" placeholder="商户编号" readonly></el-input>
                </el-form-item>
                <el-form-item label="公司名称：">
                    <el-input v-model="dataForm.companyName" placeholder="公司名称" readonly></el-input>
                </el-form-item>
                <el-form-item label="公司简称：">
                    <el-input v-model="dataForm.shortName" placeholder="公司简称" readonly></el-input>
                </el-form-item>
                <el-form-item label="营业执照所在地：">
                    <el-input v-model="dataForm.bussicAdress" placeholder="营业执照所在地" readonly></el-input>
                </el-form-item>
                <el-form-item label="法人姓名：">
                    <el-input v-model="dataForm.lawName" placeholder="法人姓名" readonly></el-input>
                </el-form-item>
                <el-form-item label="营业执照号：">
                    <el-input v-model="dataForm.businNum" placeholder="营业执照号" readonly></el-input>
                </el-form-item>
                <el-form-item label="营业期限：">
                    <span style="margin-left:15px">{{dataForm.busindate1}}</span>
                    <span>至</span>
                    <span>{{dataForm.busindate2}}</span>
                    <!-- <el-input v-model="dataForm.busindate1" placeholder="营业执照号" style="width:35%;" readonly></el-input>至 -->
                    <!-- <el-input v-model="dataForm.busindate2" placeholder="营业执照号" style="width:35%;" readonly></el-input> -->
                </el-form-item>
                <!-- <h3>联系人信息</h3> -->
                <el-form-item label="联系人姓名：">
                    <el-input v-model="dataForm.username" placeholder="联系人姓名" readonly></el-input>
                </el-form-item>
                <el-form-item label="联系人手机号：">
                    <el-input v-model="dataForm.mobile" placeholder="联系人手机号" readonly></el-input>
                </el-form-item>
                <el-form-item label="联系人邮箱：">
                    <el-input v-model="dataForm.email" placeholder="联系人邮箱" readonly></el-input>
                </el-form-item>
                <el-form-item label="职务：">
                    <el-input v-model="dataForm.work" placeholder="职务" readonly></el-input>
                </el-form-item>
                <!-- <h3>账号信息</h3> -->
                <el-form-item label="登录账号：">
                    <el-input v-model="dataForm.loginAcc" placeholder="登录账号" readonly></el-input>
                </el-form-item>
                <!-- <el-form-item label="初始密码：" prop="pwd">
                    <el-input v-model="dataForm.pwd" placeholder="初始密码" readonly></el-input>
                </el-form-item> -->
                <!-- <h3>代理商级别</h3> -->
                <el-form-item label="代理级别：">
                    <el-input v-model="dataForm.agencylevel" placeholder="代理级别" readonly></el-input>
                    <!-- <el-select v-model="dataForm.agencylevel" placeholder="请选择代理级别">
                        <el-option label="一级" value="1"></el-option>
                        <el-option label="二级" value="2"></el-option>
                    </el-select> -->
                </el-form-item>
                <el-form-item label="单价：">
                    <span style="margin-left:15px">{{dataForm.price}}</span>
                    <!-- <el-input v-model="dataForm.price" placeholder="单价" readonly></el-input> -->
                    <span>元/条</span>
                </el-form-item>
                <el-form-item label="预警条数：">
                    <span style="margin-left:15px">{{dataForm.allowCounts}}</span>
                    <!-- <el-input v-model="" placeholder="预警条数" readonly></el-input> -->
                    <span>条</span>
                </el-form-item>
            </el-form>
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
                    url: this.$http.adornUrl(`agent/agentInfo/detail?token=${this.$cookie.get('token')}&agentId=${this.dataForm.id}`),
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