<template>
    <el-dialog :title="!dataForm.id ? '新增代理商' : '修改代理商'" width="1000px" :close-on-click-modal="false" :visible.sync="visible" :before-close="closeDialog"
        v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.4)">
        <el-steps :active="currentStep" align-center finish-status="success" class="steps-wrapper">
            <el-step title="基本信息"></el-step>
            <el-step title="联系人信息"></el-step>
            <el-step title="空号检测等级"></el-step>
            <el-step title="实时检测等级"></el-step>
            <el-step title="国际检测等级"></el-step>
            <el-step title="定向通用检测等级"></el-step>
            <el-step title="line定向检测等级"></el-step>
        </el-steps>
        <el-form class="agent-edit-form demo-ruleForm" :model="dataForm" :rules="datarules" ref="dataForm" label-width="150px" :label-position="labelPosition">
            <div v-show="currentStep === 0">
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
                    <el-input v-model="dataForm.bussicAdress" placeholder="营业执照所在地"></el-input>
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
            </div>
            <div v-show="currentStep === 1">
                <el-form-item label="联系人姓名：" prop="username">
                    <el-input v-model="dataForm.username" placeholder="联系人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系人手机号：" prop="mobile">
                    <el-input v-model="dataForm.mobile" placeholder="联系人手机号" maxlength="11" :readonly="agentReadonly"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
                </el-form-item>
            </div>
            <div v-show="currentStep === 2">
                <el-form-item label="空号检测等级：" prop="agentLevel">
                    <el-select style="width: 100%;" v-model="dataForm.agentLevel" placeholder="请选择空号检测等级" @change="changeLevel('spaceLevelArr', 'agentLevel')">
                        <el-option :value="item.level" :label="item.level" v-for="(item,index) in spaceLevelArr" :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单价：" prop="price">
                    <el-input class="small-width-input" disabled v-model="dataForm.price" placeholder="单价"></el-input>
                    <span>元/条</span>
                </el-form-item>
                <el-form-item label="预警条数：" prop="warningsNumber">
                    <el-input class="small-width-input" disabled v-model="dataForm.warningsNumber" placeholder="预警条数"></el-input>
                    <span>条</span>
                </el-form-item>
                <el-form-item label="最小充值金额：" prop="minPaymentAmount">
                    <el-input class="small-width-input" disabled v-model="dataForm.minPaymentAmount" placeholder="最小充值金额"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="最小充值条数：" prop="minRechargeNumber">
                    <el-input class="small-width-input" disabled v-model="dataForm.minRechargeNumber" placeholder="最小充值条数"></el-input>
                    <span>条</span>
                </el-form-item>
            </div>
            <div v-show="currentStep === 3">
                <el-form-item label="实时检测等级：" prop="realLevel">
                    <el-select style="width: 100%;" v-model="dataForm.realLevel" placeholder="请选择实时检测等级" @change="changeLevel('realLevelArr', 'realLevel')">
                        <el-option :value="item.level + ''" :label="item.level" v-for="(item,index) in realLevelArr" :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单价：" prop="realPrice">
                    <el-input class="small-width-input" disabled v-model="dataForm.realPrice" placeholder="单价"></el-input>
                    <span>元/条</span>
                </el-form-item>
                <el-form-item label="预警条数：" prop="realWarningsNumber">
                    <el-input class="small-width-input" disabled v-model="dataForm.realWarningsNumber" placeholder="预警条数"></el-input>
                    <span>条</span>
                </el-form-item>
                <el-form-item label="最小充值金额：" prop="realMinPaymentAmount">
                    <el-input class="small-width-input" disabled v-model="dataForm.realMinPaymentAmount" placeholder="最小充值金额"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="最小充值条数：" prop="realMinRechargeNumber">
                    <el-input class="small-width-input" disabled v-model="dataForm.realMinRechargeNumber" placeholder="最小充值条数"></el-input>
                    <span>条</span>
                </el-form-item>
            </div>
            <div v-show="currentStep === 4">
                <el-form-item label="国际检测等级：" prop="internationalLevel">
                    <el-select style="width: 100%;" v-model="dataForm.internationalLevel" placeholder="请选择国际检测等级" @change="changeLevel('internationalLevelArr', 'internationalLevel')">
                        <el-option :value="item.level + ''" :label="item.level" v-for="(item,index) in internationalLevelArr" :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单价：" prop="internationalPrice">
                    <el-input class="small-width-input" disabled v-model="dataForm.internationalPrice" placeholder="单价"></el-input>
                    <span>元/条</span>
                </el-form-item>
                <el-form-item label="预警条数：" prop="internationalWarningsNumber">
                    <el-input class="small-width-input" disabled v-model="dataForm.internationalWarningsNumber" placeholder="预警条数"></el-input>
                    <span>条</span>
                </el-form-item>
                <el-form-item label="最小充值金额：" prop="internationalMinPaymentAmount">
                    <el-input class="small-width-input" disabled v-model="dataForm.internationalMinPaymentAmount" placeholder="最小充值金额"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="最小充值条数：" prop="internationalMinRechargeNumber">
                    <el-input class="small-width-input" disabled v-model="dataForm.internationalMinRechargeNumber" placeholder="最小充值条数"></el-input>
                    <span>条</span>
                </el-form-item>
            </div>
            <div v-show="currentStep === 5">
                <el-form-item label="定向通用检测等级：" prop="directCommonLevel">
                    <el-select style="width: 100%;" v-model="dataForm.directCommonLevel" placeholder="请选择定向通用检测等级" @change="changeLevel('directCommonLevelArr', 'directCommonLevel')">
                        <el-option :value="item.level + ''" :label="item.level" v-for="(item,index) in directCommonLevelArr" :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单价：" prop="directCommonPrice">
                    <el-input class="small-width-input" disabled v-model="dataForm.directCommonPrice" placeholder="单价"></el-input>
                    <span>元/条</span>
                </el-form-item>
                <el-form-item label="预警条数：" prop="directCommonWarningsNumber">
                    <el-input class="small-width-input" disabled v-model="dataForm.directCommonWarningsNumber" placeholder="预警条数"></el-input>
                    <span>条</span>
                </el-form-item>
                <el-form-item label="最小充值金额：" prop="directCommonMinPaymentAmount">
                    <el-input class="small-width-input" disabled v-model="dataForm.directCommonMinPaymentAmount" placeholder="最小充值金额"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="最小充值条数：" prop="directCommonMinRechargeNumber">
                    <el-input class="small-width-input" disabled v-model="dataForm.directCommonMinRechargeNumber" placeholder="最小充值条数"></el-input>
                    <span>条</span>
                </el-form-item>
            </div>
            <div v-show="currentStep === 6">
                <el-form-item label="line定向检测等级：" prop="lineDirectLevel">
                    <el-select style="width: 100%;" v-model="dataForm.lineDirectLevel" placeholder="请选择line定向检测等级" @change="changeLevel('lineDirectLevelArr', 'lineDirectLevel')">
                        <el-option :value="item.level + ''" :label="item.level" v-for="(item,index) in lineDirectLevelArr" :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单价：" prop="lineDirectPrice">
                    <el-input class="small-width-input" disabled v-model="dataForm.lineDirectPrice" placeholder="单价"></el-input>
                    <span>元/条</span>
                </el-form-item>
                <el-form-item label="预警条数：" prop="lineDirectWarningsNumber">
                    <el-input class="small-width-input" disabled v-model="dataForm.lineDirectWarningsNumber" placeholder="预警条数"></el-input>
                    <span>条</span>
                </el-form-item>
                <el-form-item label="最小充值金额：" prop="lineDirectMinPaymentAmount">
                    <el-input class="small-width-input" disabled v-model="dataForm.lineDirectMinPaymentAmount" placeholder="最小充值金额"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="最小充值条数：" prop="lineDirectMinRechargeNumber">
                    <el-input class="small-width-input" disabled v-model="dataForm.lineDirectMinRechargeNumber" placeholder="最小充值条数"></el-input>
                    <span>条</span>
                </el-form-item>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="currentStep === 0" @click="clearAgent()">取消</el-button>
            <el-button v-else @click="handleStepChange(false)">上一步</el-button>
            <el-button v-if="currentStep !== 6" type="primary" @click="handleStepChange(true)">下一步</el-button>
            <el-button v-else type="primary" :loading="submitLoading" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>

</template>
<script>
    import { isMobile } from '@/utils/validate'
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
                currentStep: 0,
                agentReadonly: false,
                loading: false,
                submitLoading: false,
                priseurl: '',
                licensePicNo: '',
                visible: false,
                labelPosition: 'right',
                spaceLevelArr: [],
                realLevelArr: [],
                internationalLevelArr: [],
                directCommonLevelArr: [],
                lineDirectLevelArr: [],
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
                    internationalLevel: '',
                    internationalPrice: '',
                    internationalWarningsNumber: '',
                    internationalMinPaymentAmount: '',
                    internationalMinRechargeNumber: '',
                    directCommonLevel: '',
                    directCommonPrice: '',
                    directCommonWarningsNumber: '',
                    directCommonMinPaymentAmount: '',
                    directCommonMinRechargeNumber: '',
                    lineDirectLevel: '',
                    lineDirectPrice: '',
                    lineDirectWarningsNumber: '',
                    lineDirectMinPaymentAmount: '',
                    lineDirectMinRechargeNumber: '',
                    shortName: '',
                    priseimageUrl: ''
                },
                datarules: {
                    priseimageUrl: [
                        { required: true, message: '请上传营业执照', trigger: 'change' }
                    ],
                    companyName: [
                        { required: true, message: '请输入公司名称', trigger: 'change' }
                    ],
                    shortName: [
                        { required: true, message: '请输入公司简称', trigger: 'change' }
                    ],
                    bussicAdress: [
                        { required: true, message: '请输入营业执照所在地', trigger: 'change' }
                    ],
                    lawName: [
                        { required: true, message: '请输入法人姓名', trigger: 'change' }
                    ],
                    businNum: [
                        { required: true, message: '请输入营业执照号', trigger: 'change' }
                    ],
                    busindate1: [
                        { required: true, message: '请输入成立日期', trigger: 'change' }
                    ],
                    busindate2: [
                        { required: true, message: '请输入有效期', trigger: 'change' }
                    ],
                    username: [
                        { required: true, message: '请输入联系人姓名', trigger: 'change' }
                    ],
                    mobile: [
                        { required: true, message: '请输入联系电话', trigger: 'change' },
                        { validator: validateMobile, trigger: 'change' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'change' }
                    ],
                    agentLevel: [
                        { required: true, message: '请选择空号检测等级', trigger: 'change' }
                    ],
                    price: [
                        { required: true, message: '请输入单价', trigger: 'change' }
                    ],
                    warningsNumber: [
                        { required: true, message: '请输入预警条数', trigger: 'change' }
                    ],
                    minPaymentAmount: [
                        { required: true, message: '请输入最小充值金额', trigger: 'change' }
                    ],
                    minRechargeNumber: [
                        { required: true, message: '请输入最小充值条数', trigger: 'change' }
                    ],
                }
            }
        },
        methods: {
            showInit(id) {
                this.dataForm.id = id || 0
                this.currentStep = 0
                this.visible = true
                this.submitLoading = false
                this.getSpaceLevelList()
                this.getRealLevelList()
                this.getInternationalLevelList()
                this.getDirectCommonLevelList()
                this.getLineDirectLevelList()
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                })
                this.priseurl = this.$http.adornUrl(`agent/agentInfo/license/upload?token=${this.$cookie.get('token')}`)
                if (this.dataForm.id) {
                    this.agentReadonly = false
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
                        this.licensePicNo = data.data.businessLicensePath
                        this.dataForm.priseimageUrl = this.$imgPreStr + data.data.businessLicensePath
                        this.dataForm.companyName = data.data.companyName
                        this.dataForm.shortName = data.data.companyShortName
                        this.dataForm.bussicAdress = data.data.businessLicenseAddress
                        this.dataForm.lawName = data.data.legalPerson
                        this.dataForm.businNum = data.data.businessLicenseNumber
                        this.dataForm.busindate1 = data.data.businessLicenseExpireStartTime
                        this.dataForm.busindate2 = data.data.businessLicenseExpireEndTime

                        this.dataForm.username = data.data.linkmanName
                        this.dataForm.mobile = data.data.linkmanPhone
                        this.dataForm.email = data.data.linkmanEmail

                        this.dataForm.agentLevel = data.data.agentLevel + ''
                        this.dataForm.price = data.data.price
                        this.dataForm.warningsNumber = data.data.warningsNumber
                        this.dataForm.minPaymentAmount = data.data.minPaymentAmount
                        this.dataForm.minRechargeNumber = data.data.minRechargeNumber

                        this.dataForm.realLevel = data.data.realLevel ? data.data.realLevel + '' : undefined
                        this.dataForm.realPrice = data.data.realPrice
                        this.dataForm.realWarningsNumber = data.data.realWarningsNumber
                        this.dataForm.realMinPaymentAmount = data.data.realMinPaymentAmount
                        this.dataForm.realMinRechargeNumber = data.data.realMinRechargeNumber

                        this.dataForm.internationalLevel = data.data.internationalLevel ? data.data.internationalLevel + '' : undefined
                        this.dataForm.internationalPrice = data.data.internationalPrice
                        this.dataForm.internationalWarningsNumber = data.data.internationalWarningsNumber
                        this.dataForm.internationalMinPaymentAmount = data.data.internationalMinPaymentAmount
                        this.dataForm.internationalMinRechargeNumber = data.data.internationalMinRechargeNumber

                        this.dataForm.directCommonLevel = data.data.directCommonLevel ? data.data.directCommonLevel + '' : undefined
                        this.dataForm.directCommonPrice = data.data.directCommonPrice
                        this.dataForm.directCommonWarningsNumber = data.data.directCommonWarningsNumber
                        this.dataForm.directCommonMinPaymentAmount = data.data.directCommonMinPaymentAmount
                        this.dataForm.directCommonMinRechargeNumber = data.data.directCommonMinRechargeNumber

                        this.dataForm.lineDirectLevel = data.data.lineDirectLevel ? data.data.lineDirectLevel + '' : undefined
                        this.dataForm.lineDirectPrice = data.data.lineDirectPrice
                        this.dataForm.lineDirectWarningsNumber = data.data.lineDirectWarningsNumber
                        this.dataForm.lineDirectMinPaymentAmount = data.data.lineDirectMinPaymentAmount
                        this.dataForm.lineDirectMinRechargeNumber = data.data.lineDirectMinRechargeNumber
                    }
                })
            },
            getSpaceLevelList() {
                this.$http({
                    url: this.$http.adornUrl(`agent/level/list?token=${this.$cookie.get('token')}&levelType=0`),
                    method: 'get',
                    param: this.$http.adornParams({})
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.spaceLevelArr = data.data || []
                    } else {
                        this.spaceLevelArr = []
                    }
                })
            },
            getInternationalLevelList() {
                this.$http({
                    url: this.$http.adornUrl(`agent/level/list?token=${this.$cookie.get('token')}&levelType=2`),
                    method: 'get',
                    param: this.$http.adornParams({})
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.internationalLevelArr = data.data || []
                    } else {
                        this.internationalLevelArr = []
                    }
                })
            },
            getRealLevelList() {
                this.$http({
                    url: this.$http.adornUrl(`agent/level/list?token=${this.$cookie.get('token')}&levelType=1`),
                    method: 'get',
                    param: this.$http.adornParams({})
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.realLevelArr = data.data || []
                    } else {
                        this.realLevelArr = []
                    }
                })
            },
            getLineDirectLevelList() {
                this.$http({
                    url: this.$http.adornUrl(`agent/level/list?token=${this.$cookie.get('token')}&levelType=5`),
                    method: 'get',
                    param: this.$http.adornParams({})
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.lineDirectLevelArr = data.data || []
                    } else {
                        this.lineDirectLevelArr = []
                    }
                })
            },
            getDirectCommonLevelList() {
                this.$http({
                    url: this.$http.adornUrl(`agent/level/list?token=${this.$cookie.get('token')}&levelType=4`),
                    method: 'get',
                    param: this.$http.adornParams({})
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.directCommonLevelArr = data.data || []
                    } else {
                        this.directCommonLevelArr = []
                    }
                })
            },
            dataFormSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/agentInfo/${!this.dataForm.id ? 'save' : 'update'}?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'agentId': this.dataForm.id || undefined,
                                'businessLicensePath': this.licensePicNo,
                                'companyName': this.dataForm.companyName,
                                'companyShortName': this.dataForm.shortName,
                                'businessLicenseAddress': this.dataForm.bussicAdress,
                                'legalPerson': this.dataForm.lawName,
                                'businessLicenseNumber': this.dataForm.businNum,
                                'businessLicenseExpireStartTime': this.dataForm.busindate1,
                                'businessLicenseExpireEndTime': this.dataForm.busindate2,
                                'linkmanName': this.dataForm.username,
                                'linkmanPhone': this.dataForm.mobile,
                                'linkmanEmail': this.dataForm.email,
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
                                'internationalLevel': this.dataForm.internationalLevel,
                                'internationalPrice': this.dataForm.internationalPrice,
                                'internationalWarningsNumber': this.dataForm.internationalWarningsNumber,
                                'internationalMinPaymentAmount': this.dataForm.internationalMinPaymentAmount,
                                'internationalMinRechargeNumber': this.dataForm.internationalMinRechargeNumber,
                                'directCommonLevel': this.dataForm.directCommonLevel,
                                'directCommonPrice': this.dataForm.directCommonPrice,
                                'directCommonWarningsNumber': this.dataForm.directCommonWarningsNumber,
                                'directCommonMinPaymentAmount': this.dataForm.directCommonMinPaymentAmount,
                                'directCommonMinRechargeNumber': this.dataForm.directCommonMinRechargeNumber,
                                'lineDirectLevel': this.dataForm.lineDirectLevel,
                                'lineDirectPrice': this.dataForm.lineDirectPrice,
                                'lineDirectWarningsNumber': this.dataForm.lineDirectWarningsNumber,
                                'lineDirectMinPaymentAmount': this.dataForm.lineDirectMinPaymentAmount,
                                'lineDirectMinRechargeNumber': this.dataForm.lineDirectMinRechargeNumber,
                            })
                        }).then(({ data }) => {
                            this.submitLoading = false
                            if (data && data.code === 0) {
                                this.visible = false
                                this.$emit('refreshDataList', this.dataForm.id ? undefined : 1)
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.dataForm.priseimageUrl = ""
                                        this.licensePicNo = ""
                                        this.dataForm.busindate2 = ""
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
                const isJPG = (file.type === 'image/jpeg') || (file.type == 'image/png') || (file.type == 'image/jpg');
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG\PNG\JPEG 格式!');
                    return false
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    return false
                }
                this.loading = true
                return true;
            },
            perisehandleAvatarSuccess(res, file) {
                if (res.code == 0) {
                    this.loading = false
                    this.dataForm.priseimageUrl = URL.createObjectURL(file.raw);
                    this.licensePicNo = res.data.businessLicensePath
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
            changeLevel(levelArrStr, key) {
                this.$nextTick(() => {
                    let levelArr = this[levelArrStr]
                    let selected = levelArr.find(item => {
                        return item.level + '' === this.dataForm[key]
                    }) || {}
                    const { price, warningsNumber, minPaymentAmount, minRechargeNumber } = selected
                    switch (key) {
                        case 'realLevel': {
                            // 实时检测等级
                            this.dataForm.realPrice = price
                            this.dataForm.realWarningsNumber = warningsNumber
                            this.dataForm.realMinPaymentAmount = minPaymentAmount
                            this.dataForm.realMinRechargeNumber = minRechargeNumber
                            break;
                        }
                        case 'agentLevel': {
                            // 空号检测等级
                            this.dataForm.price = price
                            this.dataForm.warningsNumber = warningsNumber
                            this.dataForm.minPaymentAmount = minPaymentAmount
                            this.dataForm.minRechargeNumber = minRechargeNumber
                            break;
                        }
                        case 'internationalLevel': {
                            // 国际检测等级
                            this.dataForm.internationalPrice = price
                            this.dataForm.internationalWarningsNumber = warningsNumber
                            this.dataForm.internationalMinPaymentAmount = minPaymentAmount
                            this.dataForm.internationalMinRechargeNumber = minRechargeNumber
                            break;
                        }
                        case 'directCommonLevel': {
                            // 定向通用检测
                            this.dataForm.directCommonPrice = price
                            this.dataForm.directCommonWarningsNumber = warningsNumber
                            this.dataForm.directCommonMinPaymentAmount = minPaymentAmount
                            this.dataForm.directCommonMinRechargeNumber = minRechargeNumber
                            break;
                        }
                        case 'lineDirectLevel': {
                            // line定向检测
                            this.dataForm.lineDirectPrice = price
                            this.dataForm.lineDirectWarningsNumber = warningsNumber
                            this.dataForm.lineDirectMinPaymentAmount = minPaymentAmount
                            this.dataForm.lineDirectMinRechargeNumber = minRechargeNumber
                            break;
                        }
                        default:
                            break;
                    }
                });
            },
            handleStepChange(isNext) {
                if (!isNext) {
                    this.currentStep = this.currentStep - 1
                    return false
                }
                let stepFieldsMap = {
                    '0': ['priseimageUrl', 'companyName', 'shortName', 'bussicAdress', 'lawName', 'businNum', 'busindate1', 'busindate2'],
                    '1': ['username', 'mobile', 'email'],
                    '2': ['agentLevel', 'price', 'warningsNumber', 'minPaymentAmount', 'minRechargeNumber'],
                }
                const validateFieldPromise = (field) => {
                    return new Promise((resolve, reject) => {
                        this.$refs['dataForm'].validateField(field,(valid) => {
                            if (valid) {
                                reject()
                            } else {
                                resolve()
                            }
                        })
                    })
                }
                let fieldArr = stepFieldsMap[this.currentStep] || []
                let validatePromiseArr = fieldArr.map(ele => {
                    return validateFieldPromise(ele)
                })
                Promise.all(validatePromiseArr).then(() => {
                    this.currentStep = this.currentStep + 1
                })
            },
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
<style lang="scss" scoped>
    .small-width-input {
        width: 86%;
        margin-right: 8px;
    }
    .steps-wrapper {
        margin-bottom: 24px;
    }
</style>