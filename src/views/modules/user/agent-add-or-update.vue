<template>
    <el-dialog :title="!dataForm.id ? '新增代理商' : '修改代理商'" :close-on-click-modal="false" :visible.sync="visible" :before-close="closeDialog"
        v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.4)">
        <el-form :model="dataForm" :rules="datarules" ref="dataForm" label-width="150px" class="demo-ruleForm" :label-position="labelPosition">
            <h3>基本信息</h3>
            <el-form-item label="上传营业执照：" prop="priseimageUrl">
                <el-upload class="avatar-uploader" :action="priseurl" accept="image/jpeg,image/jpg,image/png" :show-file-list="false" :on-success="perisehandleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="dataForm.priseimageUrl" :src="dataForm.priseimageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <input type="hidden" v-model="dataForm.priseimageUrl" />
                </el-upload>
                <span>（上传后，以下部分信息可自动导入）</span>
            </el-form-item>
            <el-form-item label="公司名称：" prop="companyName">
                <el-input v-model="dataForm.companyName" placeholder="公司名称"></el-input>
            </el-form-item>
            <el-form-item label="公司简称：" prop="shortName">
                <el-input v-model="dataForm.shortName" placeholder="公司简称"></el-input>
            </el-form-item>
            <el-form-item label="营业执照所在地：" prop="bussicAdress">
                <el-input v-model="dataForm.bussicAdress" placeholder=".营业执照所在地"></el-input>
            </el-form-item>
            <el-form-item label="法人姓名：" prop="lawName">
                <el-input v-model="dataForm.lawName" placeholder="法人姓名"></el-input>
            </el-form-item>
            <el-form-item label="营业执照号：" prop="businNum">
                <el-input v-model="dataForm.businNum" placeholder="营业执照号"></el-input>
            </el-form-item>
            <el-form-item label="成立日期：" prop="busindate1">
                <el-input v-model="dataForm.busindate1" placeholder="成立日期"></el-input>
            </el-form-item>
            <el-form-item label="有效期：" prop="busindate2">
                <el-input v-model="dataForm.busindate2" placeholder="有效期"></el-input>
            </el-form-item>
            <h3>联系人信息</h3>
            <el-form-item label="联系人姓名：" prop="username">
                <el-input v-model="dataForm.username" placeholder="联系人姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系人手机号：" prop="mobile">
                <el-input v-model="dataForm.mobile" placeholder="联系人手机号" maxlength="11" :readonly="agentReadonly"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
            </el-form-item>
            <h3>空号检测等级</h3>
            <el-form-item label="空号检测等级：" prop="agentLevel">
                <el-select style="width: 100%;" v-model="dataForm.agentLevel" placeholder="请选择空号检测等级" @change="changeLevel(false, dataForm.agentLevel)">
                    <el-option :value="item.id" :label="item.name" v-for="(item,index) in spaceLevelArr" :key="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单价：" prop="price">
                <el-input disabled v-model="dataForm.price" placeholder="单价"></el-input>
                <span>元/条</span>
            </el-form-item>
            <el-form-item label="预警条数：" prop="warningsNumber">
                <el-input disabled v-model="dataForm.warningsNumber" placeholder="预警条数"></el-input>
                <span>条</span>
            </el-form-item>
            <el-form-item label="最小充值金额：" prop="minPaymentAmount">
                <el-input disabled v-model="dataForm.minPaymentAmount" placeholder="最小充值金额"></el-input>
                <span>元</span>
            </el-form-item>
            <el-form-item label="最小充值条数：" prop="minRechargeNumber">
                <el-input disabled v-model="dataForm.minRechargeNumber" placeholder="最小充值条数"></el-input>
                <span>条</span>
            </el-form-item>
            <h3>实时检测等级</h3>
            <el-form-item label="实时检测等级：" prop="realLevel">
                <el-select style="width: 100%;" v-model="dataForm.realLevel" placeholder="请选择实时检测等级" @change="changeLevel(true, dataForm.realLevel)">
                    <el-option :value="item.id" :label="item.name" v-for="(item,index) in realLevelArr" :key="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单价：" prop="realPrice">
                <el-input disabled v-model="dataForm.realPrice" placeholder="单价"></el-input>
                <span>元/条</span>
            </el-form-item>
            <el-form-item label="预警条数：" prop="realWarningsNumber">
                <el-input disabled v-model="dataForm.realWarningsNumber" placeholder="预警条数"></el-input>
                <span>条</span>
            </el-form-item>
            <el-form-item label="最小充值金额：" prop="realMinPaymentAmount">
                <el-input disabled v-model="dataForm.realMinPaymentAmount" placeholder="最小充值金额"></el-input>
                <span>元</span>
            </el-form-item>
            <el-form-item label="最小充值条数：" prop="realMinRechargeNumber">
                <el-input disabled v-model="dataForm.realMinRechargeNumber" placeholder="最小充值条数"></el-input>
                <span>条</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="clearAgent()">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>

</template>
<script>
    import { isMobile } from '@/utils/validate'
    import imgUrl from '@/utils/imgUrl'
    export default {
        data() {
            var validateMobile = (rule, value, callback) => {
                if (!isMobile(value)) {
                    callback(new Error('手机号格式错误'))
                } else {
                    callback()
                }
            }
            return {
                agentReadonly: false,
                loading: false,
                priseurl: "",
                licensePicNo: '',
                visible: false,
                labelPosition: 'right',
                spaceLevelArr: [],
                realLevelArr: [],
                dataForm: {
                    id: 0,
                    companyName: '',
                    bussicAdress: '',
                    lawName: '',
                    businNum: '',
                    busindate1: '',
                    busindate2: '',
                    username: '',
                    mobile: '',
                    email: '',
                    pwd: '',
                    agentLevel: '',
                    price: '',
                    warningsNumber: '',
                    minPaymentAmount: '',
                    minRechargeNumber: '',
                    realLevel: '',
                    realPrice: '',
                    realWarningsNumber: '',
                    realMinPaymentAmount: '',
                    realMinRechargeNumber: '',
                    shortName: '',
                    priseimageUrl: ''
                },
                datarules: {
                    priseimageUrl: [
                        { required: true, message: '请上传营业执照', trigger: 'blur' }
                    ],
                    companyName: [
                        { required: true, message: '请输入公司名称', trigger: 'blur' }
                    ],
                    shortName: [
                        { required: true, message: '请输入公司简称', trigger: 'blur' }
                    ],
                    bussicAdress: [
                        { required: true, message: '请输入营业执照所在地', trigger: 'blur' }
                    ],
                    lawName: [
                        { required: true, message: '请输入法人姓名', trigger: 'blur' }
                    ],
                    businNum: [
                        { required: true, message: '请输入营业执照号', trigger: 'blur' }
                    ],
                    busindate1: [
                        { required: true, message: '请输入成立日期', trigger: 'blur' }
                    ],
                    busindate2: [
                        { required: true, message: '请输入有效期', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入联系电话', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' }
                    ],
                    agentLevel: [
                        { required: true, message: '请选择空号检测等级', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '请输入单价', trigger: 'blur' }
                    ],
                    warningsNumber: [
                        { required: true, message: '请输入预警条数', trigger: 'blur' }
                    ],
                    minPaymentAmount: [
                        { required: true, message: '请输入最小充值金额', trigger: 'blur' }
                    ],
                    minRechargeNumber: [
                        { required: true, message: '请输入最小充值条数', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            showInit(id) {
                this.dataForm.id = id || 0
                this.visible = true
                this.getSpaceLevelList();
                this.getRealLevelList();
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                })
                this.priseurl = this.$http.adornUrl(`agent/agentInfo/license/upload?token=${this.$cookie.get('token')}`)
                if (this.dataForm.id) {
                    this.agentReadonly = true
                    this.getAgentDetail();
                }
            },
            getAgentDetail() {
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/detail?token=${this.$cookie.get('token')}&agentId=${this.dataForm.id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataForm.priseimageUrl = imgUrl.imgUrl + data.data.licenseUrl
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

                        this.dataForm.agentLevel = data.data.levelId
                        this.dataForm.price = data.data.price
                        this.dataForm.warningsNumber = data.data.warningsNumber
                        this.dataForm.minPaymentAmount = data.data.minPaymentAmount
                        this.dataForm.minRechargeNumber = data.data.minRechargeNumber

                        this.dataForm.realLevel = data.data.realLevel
                        this.dataForm.realPrice = data.data.realPrice
                        this.dataForm.realWarningsNumber = data.data.realWarningsNumber
                        this.dataForm.realMinPaymentAmount = data.data.realMinPaymentAmount
                        this.dataForm.realMinRechargeNumber = data.data.realMinRechargeNumber
                    }
                })
            },
            getSpaceLevelList() {
                this.$http({
                    url: this.$http.adornUrl(`agent/level/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    param: this.$http.adornParams({
                        levelType: 0
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.spaceLevelArr = data.data
                    } else {
                        this.spaceLevelArr = []
                    }
                })
            },
            getRealLevelList() {
                this.$http({
                    url: this.$http.adornUrl(`agent/level/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    param: this.$http.adornParams({
                        levelType: 1
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.realLevelArr = data.data
                    } else {
                        this.realLevelArr = []
                    }
                })
            },
            dataFormSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/agentInfo/${!this.dataForm.id ? 'save' : 'update'}?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'agentId': this.dataForm.id || undefined,
                                'licensePicNo': this.licensePicNo,
                                'companyName': this.dataForm.companyName,
                                'shortName': this.dataForm.shortName,
                                'address': this.dataForm.bussicAdress,
                                'legalPerson': this.dataForm.lawName,
                                'licenseNo': this.dataForm.businNum,
                                'effectDate': this.dataForm.busindate1,
                                'expireDate': this.dataForm.busindate2,
                                'contactName': this.dataForm.username,
                                'mobile': this.dataForm.mobile,
                                'email': this.dataForm.email,
                                'agentLevel': this.dataForm.agentLevel,
                                'price': this.dataForm.price,
                                'warningsNumber': this.dataForm.warningsNumber,
                                'minPaymentAmount': this.dataForm.minPaymentAmount,
                                'minRechargeNumber': this.dataForm.minRechargeNumber,
                                'realLevel': this.dataForm.realLevel,
                                'realPrice': this.dataForm.realPrice,
                                'realWarningsNumber': this.dataForm.realWarningsNumber,
                                'realMinPaymentAmount': this.dataForm.realMinPaymentAmount,
                                'realMinRechargeNumber': this.dataForm.realMinRechargeNumber,
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false
                                        this.dataForm.priseimageUrl = ""
                                        this.licensePicNo = ""
                                        this.dataForm.busindate2 = ""
                                        this.$emit('refreshDataList')
                                    }
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    } else {
                        this.$message.error('请完善信息!')
                    }
                })
            },
            clearAgent() {
                this.visible = false
                this.dataForm.priseimageUrl = ""
                this.licensePicNo = ""
                this.dataForm.busindate1 = ""
                this.dataForm.busindate2 = ""
            },
            beforeAvatarUpload(file) {
                this.loading = true
                const isJPG = (file.type === 'image/jpeg') || (file.type == 'image/png') || (file.type == 'image/jpg');
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            perisehandleAvatarSuccess(res, file) {
                if (res.code == 0) {
                    this.loading = false
                    this.dataForm.priseimageUrl = URL.createObjectURL(file.raw);
                    this.licensePicNo = res.data.licensePicNo
                    this.dataForm.companyName = res.data.companyName
                    this.dataForm.bussicAdress = res.data.address
                    this.dataForm.lawName = res.data.legalPerson
                    this.dataForm.businNum = res.data.licenseNo
                    this.dataForm.busindate1 = res.data.effectDate
                    this.dataForm.busindate2 = res.data.expireDate
                } else {
                    this.$message.error(res.msg)
                    this.loading = false
                }
            },
            closeDialog(done) {
                done();
                this.licensePicNo = ""
                this.dataForm.priseimageUrl = ""
                this.dataForm.busindate1 = ""
                this.dataForm.busindate2 = ""
                this.agentReadonly = false
            },
            changeLevel(isReal, val) {
                let selected = {};
                let levelArr = isReal ? this.realLevelArr : this.spaceLevelArr
                selected = levelArr.find(item => {
                    return item.id === val
                });
                if (isReal) {
                    // 实时检测等级
                    this.dataForm.realPrice = selected.price
                    this.dataForm.realWarningsNumber = selected.realWarningsNumber
                    this.dataForm.realMinPaymentAmount = selected.realMinPaymentAmount
                    this.dataForm.realMinRechargeNumber = selected.realMinRechargeNumber
                } else {
                    // 空号检测等级
                    this.dataForm.price = selected.price
                    this.dataForm.warningsNumber = selected.warningsNumber
                    this.dataForm.minPaymentAmount = selected.minPaymentAmount
                    this.dataForm.minRechargeNumber = selected.minRechargeNumber
                }
            }
        }
    }

</script>
<style lang="scss">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }

    #agentNumberCss .el-input__inner {
        border: none
    }
</style>