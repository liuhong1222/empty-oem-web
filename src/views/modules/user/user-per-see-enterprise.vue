<template>
    <div class="seecuslog">
        <!-- 客户详情信息 -->
        <el-dialog title="查看客户" :visible.sync="dialogVisible" width="800px">
            <table class="discribe-wrapper" border>
                <tbody>
                    <tr class="discribe-row">
                        <td class="discribe-col title">联系人姓名</td>
                        <td class="discribe-col">{{ detailInfo.name }}</td>
                        <td class="discribe-col title">联系人手机号码</td>
                        <td class="discribe-col">{{ detailInfo.phone }}</td>
                    </tr>
                    <tr class="discribe-row">
                        <td class="discribe-col title">联系人邮箱</td>
                        <td class="discribe-col">{{ detailInfo.email }}</td>
                        <td class="discribe-col title">营业执照地址</td>
                        <td class="discribe-col">
                            <div>{{ detailInfo.businessLicensePath }}</div>
                            <!-- {{ detailInfo.businessLicensePath }} -->
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
                        <td class="discribe-col">
                            <div>{{ detailInfo.businessLicenseNumber }}</div>
                        </td>
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
                        <td class="discribe-col title">状态</td>
                        <td class="discribe-col">{{ detailInfo.state }}</td>
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

        <!-- 查看个人信息 -->
        <el-dialog v-if="false" title="查看个人客户" :visible.sync="perseeVisible" width="48%">

            <el-form :model="perseeDataForm" ref="perDataForm" label-width="150px" :label-position="labelPosition">
                <el-form-item label="手机号码：">
                    <el-input v-model="perseeDataForm.mobile" placeholder="手机号码" readonly></el-input>
                </el-form-item>
                <!-- <el-form-item label="客户编号">
                    <el-input v-model="perseeDataForm.custNum" placeholder="客户编号" readonly></el-input>
                </el-form-item> -->
                <el-form-item label="身份证照片" id="avatar-uploaderFceImg">
                    <el-upload class="avatar-uploader" action="" :show-file-list="false" style="display:inline-block" disabled>
                        <img v-if="imageUrlFace" :src="imageUrlFace" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" style="font-size:14px">正面</i>
                    </el-upload>
                    <el-upload class="avatar-uploader" action="" :show-file-list="false" style="display:inline-block" disabled>
                        <img v-if="imageUrlback" :src="imageUrlback" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" style="font-size:14px">反面</i>
                    </el-upload>

                </el-form-item>
                <el-form-item label="客户姓名">
                    <el-input v-model="perseeDataForm.custNanme" placeholder="客户姓名" readonly></el-input>
                </el-form-item>
                <el-form-item label="身份证号码">
                    <el-input v-model="perseeDataForm.perIdno" placeholder="身份证号码" readonly></el-input>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="perseeDataForm.peraddress" placeholder="详细地址" readonly></el-input>
                </el-form-item>
                <el-form-item label="证件期限">
                    <el-input v-model="perseeDataForm.pertimelimit1" placeholder="开始" style="width:35%" readonly></el-input> 至
                    <el-input v-model="perseeDataForm.pertimelimit2" placeholder="结束" style="width:35%" readonly></el-input>
                </el-form-item>
                <el-form-item label="联系邮箱">
                    <el-input v-model="perseeDataForm.peremail" placeholder="联系邮箱" readonly></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="perseeVisible = false">取 消</el-button>
                <el-button type="primary"  @click="perseeVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 查看企业信息 -->
        <el-dialog v-if="false" title=" 查看企业客户" :visible.sync="entriseVisible" width="52%">

            <el-form :model="seepriseDataForm" ref="seepriseDataFormref" label-width="150px" :label-position="labelPosition">
                <el-form-item label="手机号码：">
                    <el-input v-model="seepriseDataForm.mobile" placeholder="手机号码"></el-input>
                </el-form-item>
                <!-- <el-form-item label="客户编号：">
                    <el-input v-model="seepriseDataForm.prisecustNum" placeholder="客户编号"></el-input>
                </el-form-item> -->
                <el-form-item label="营业执照：" id="avatar-uploaderpriseImg">
                    <el-upload class="avatar-uploader" action="" :show-file-list="false" readonly disabled>
                        <img v-if="priseimageUrl" :src="priseimageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="公司名称：">
                    <el-input v-model="seepriseDataForm.priseComName" placeholder="公司名称"></el-input>
                </el-form-item>
                <el-form-item label="营业执照号：">
                    <el-input v-model="seepriseDataForm.businNum" placeholder="营业执照号"></el-input>
                </el-form-item>
                <el-form-item label="公司地址：">
                    <el-input v-model="seepriseDataForm.priseaddress" placeholder="公司地址"></el-input>
                </el-form-item>
                <el-form-item label="法人姓名：">
                    <el-input v-model="seepriseDataForm.priseName" placeholder="法人姓名"></el-input>
                </el-form-item>
                <el-form-item label="营业期限：">
                    <el-input v-model="seepriseDataForm.prisetimelimit1" placeholder="开始" style="width:35%"></el-input> 至
                    <el-input v-model="seepriseDataForm.prisetimelimit2" placeholder="结束" style="width:35%"></el-input>
                </el-form-item>
                <el-form-item label="经营范围：">
                    <el-input type="textarea" v-model="seepriseDataForm.priseDesc" placeholder="经营范围" readonly></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="entriseVisible = false">取 消</el-button>
                    <el-button type="primary" @click="entriseVisible = false">确 定</el-button>
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

                perseeVisible: false,
                entriseVisible: false,
                imageUrlFace: '',
                imageUrlback: '',
                priseimageUrl: '',
                perseeDataForm: {  //个人
                    id: '',
                    creUserId: '',
                    mobile: '',
                    // custNum: '',
                    custNanme: '',
                    perIdno: '',
                    peraddress: '',
                    pertimelimit: '',
                    peremail: '',
                },
                seepriseDataForm: {//企业
                    id: '',
                    creUserId: '',
                    mobile: '',
                    // prisecustNum: '',
                    priseComName: '',
                    businNum: '',
                    priseaddress: '',
                    priseName: '',
                    prisetimelimit: '',
                    priseDesc: '',
                    bussicLice: ''
                },
                labelPosition: 'right',
            }
        },
        methods: {
            seeInit(arr) {
                this.dialogVisible = true
                // console.log(arr[0])  //id
                // console.log(arr[1])  //个人 （0，null） 还是企业（1）
                // console.log(arr[2])  //creUserId
                if (arr[1] == 0 || arr[1] == null) {  //个人
                    this.perseeVisible = true
                    this.perseeDataForm.id = arr[0]
                    this.perseeDataForm.creUserId = arr[2]
                    this.$http({
                        url: this.$http.adornUrl(`agent/cust/findPersonById?token=${this.$cookie.get('token')}&customerId=${this.perseeDataForm.id === null ? "" : this.perseeDataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            // console.log(data)
                            this.perseeDataForm.mobile = data.mobile
                            this.perseeDataForm.peremail = data.mail
                            this.imageUrlFace = imgUrl.zxaImgUrl + data.idCardInfo.faceUrl
                            this.imageUrlback = imgUrl.zxaImgUrl + data.idCardInfo.backUrl
                            // this.perseeDataForm.custNum = data.idCardInfo.creUserId
                            this.perseeDataForm.custNanme = data.idCardInfo.username
                            this.perseeDataForm.perIdno = data.idCardInfo.idno
                            this.perseeDataForm.peraddress = data.idCardInfo.address
                            this.perseeDataForm.pertimelimit1 = data.idCardInfo.effectdate
                            this.perseeDataForm.pertimelimit2 = data.idCardInfo.expiredate

                        } else {
                            this.$message.error(data.msg)
                        }
                    })

                }
                if (arr[1] == 1) { //企业
                    this.entriseVisible = true
                    this.seepriseDataForm.id = arr[0]
                    this.seepriseDataForm.creUserId = arr[2]
                    this.$http({
                        url: this.$http.adornUrl(`agent/cust/findCompanyById?token=${this.$cookie.get('token')}&id=${this.seepriseDataForm.id}&creUserId=${this.seepriseDataForm.creUserId}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            // console.log(data)
                            this.seepriseDataForm.mobile = data.mobile
                            this.priseimageUrl = imgUrl.zxaImgUrl + data.businessLicenceInfo.pictureUrl
                            // this.seepriseDataForm.prisecustNum = data.businessLicenceInfo.creUserId
                            this.seepriseDataForm.priseComName = data.businessLicenceInfo.name
                            this.seepriseDataForm.businNum = data.businessLicenceInfo.regnum
                            this.seepriseDataForm.priseaddress = data.businessLicenceInfo.address
                            this.seepriseDataForm.priseName = data.businessLicenceInfo.person
                            this.seepriseDataForm.prisetimelimit1 = data.businessLicenceInfo.effectdate
                            this.seepriseDataForm.prisetimelimit2 = data.businessLicenceInfo.expiredate
                            this.seepriseDataForm.priseDesc = data.businessLicenceInfo.business
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }

            }
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