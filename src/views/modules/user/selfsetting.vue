<template>
    <div class="main">
        <!-- 设置 -->
        <div v-show="!isView">
            <el-steps :active="currStep" finish-status="success" align-center class="settingSteps">
                <el-step title="基本信息"></el-step>
                <el-step title="客服资料"></el-step>
                <el-step title="域名备案信息"></el-step>
                <el-step title="收款资料"></el-step>
                <el-step title="支付宝资料"></el-step>
                <el-step title="合同资料"></el-step>
                <el-step title="微信资料"></el-step>
                <el-step title="其他"></el-step>
            </el-steps>
            <!-- 内容显示 -->
            <div>
                <!-- 基本信息 -->
                <div class="form-wrapper" v-if="currStep === 0 ">
                    <base-info-form ref="baseInfoFormRef" />
                </div>
                <!-- 客服资料 -->
                <div class="form-wrapper" v-if="currStep === 1">
                    <service-info-form ref="serviceInfoFormRef" />
                </div>
                <!-- 域名备案信息 -->
                <div class="form-wrapper" v-if="currStep === 2">
                    <domain-info-form ref="domainInfoFormRef" />
                </div>
                <!-- 收款资料 -->
                <div class="form-wrapper" v-if="currStep === 3">
                    <gathering-info-form ref="gatheringInfoFormRef" />
                </div>
                <!-- 支付宝资料 -->
                <div class="form-wrapper" v-if="currStep === 4 ">
                    <alipay-info-form ref="alipayInfoFormRef" />
                </div>
                <!-- 合同资料 -->
                <div class="form-wrapper" v-if="currStep === 5 ">
                    <contract-data-form ref="contractDataFormRef" />
                </div>
                <!-- 微信资料 -->
                <div class="form-wrapper" v-if="currStep === 6">
                    <wechat-info-form ref="wechatInfoFormRef" />
                </div>
                <!-- 其他 -->
                <div class="form-wrapper" v-if="currStep === 7">
                    <service-agreement-form ref="serviceAgreementFormRef" />
                </div>
            </div>
            <div class="footer">
                <el-button v-if="currStep === 0" @click="handlePre">取消</el-button>
                <el-button v-else @click="handlePre">上一步</el-button>
                <el-button v-if="currStep !== 7" type="primary" @click="handleNext">下一步</el-button>
                <el-button v-else type="primary" @click="handleNext">完成</el-button>
            </div>
        </div>
        <div v-show="isView" class="view-wrapper">
            <el-button type="primary" @click="handleEdit" class="edit-btn">编辑</el-button>
            <agent-setting-detail ref="detailRef" />
        </div>
    </div>
</template>

<script>
    import BaseInfoForm from '@/components/agent-setting-form/base-info.vue'
    import ServiceInfoForm from '@/components/agent-setting-form/service-info.vue'
    import DomainInfoForm from '@/components/agent-setting-form/domain-info.vue'
    import GatheringInfoForm from '@/components/agent-setting-form/gathering-info.vue'
    import AlipayInfoForm from '@/components/agent-setting-form/alipay-info.vue'
    import ContractDataForm from '@/components/agent-setting-form/contract-data.vue'
    import WechatInfoForm from '@/components/agent-setting-form/wechat-info.vue'
    import ServiceAgreementForm from '@/components/agent-setting-form/service-agreement.vue'
    import AgentSettingDetail from '@/components/agent-setting-detail/index.vue'
    export default {
        components: {
            BaseInfoForm,
            ServiceInfoForm,
            DomainInfoForm,
            GatheringInfoForm,
            AlipayInfoForm,
            ContractDataForm,
            WechatInfoForm,
            ServiceAgreementForm,
            AgentSettingDetail
        },
        data() {
            return {
                isView: true,
                allSettingInfo: {}, // 所有的代理商设置信息
                editSettingInfo: {}, // 编辑之后的数据
                currStep: 0,
                agentSetId: '',
                initFuncNameArr: [
                    'initBaseInfoForm',
                    'initServiceInfoForm',
                    'initDomainInfoForm',
                    'initGatheringInfoForm',
                    'initAlipayInfoForm',
                    'initContractDataForm',
                    'initWechatInfoForm',
                    'initServiceAgreementForm',
                ]
            }
        },
        activated() {
            this.initPage()
        },
        methods: {
            initPage() {
                let agentInfo = this.$json.parse(sessionStorage.getItem('agentInfo') || '{}')
                this.allSettingInfo = {
                    agentId: agentInfo.id + '',
                    agentName: agentInfo.companyName
                }
                this.currStep = 0
                this.editSettingInfo = {}
                this.getBasicInfo((data) => {
                    const { agentSetId, agentSetInfo } = data
                    this.allSettingInfo = {
                        ...this.allSettingInfo,
                        ...(agentSetInfo || {}),
                        browserRightDisplay: (agentSetInfo && agentSetInfo.browserRightDisplay) ? 1 : 0
                    }
                    this.agentSetId = agentSetId ? agentSetId + '' : undefined
                    this.isView = this.agentSetId ? true : false
                    this.$nextTick(() => {
                        if (this.isView) {
                            this.$refs.detailRef.init(this.allSettingInfo)
                        } else {
                            this.initBaseInfoForm()
                        }
                    })
                })
            },
            getBasicInfo(callback) {
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findBasicInfo?token=${this.$cookie.get('token')}&agentId=${this.allSettingInfo.agentId}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        callback(data.data || {})
                    }
                })
            },
            handlePre() {
                if (this.currStep === 0) {
                    this.isView = true
                    return true
                }
                this.currStep = this.currStep - 1
                this.$nextTick(() => {
                    this[this.initFuncNameArr[this.currStep]]()
                })
            },
            handleNext() {
                if (this.currStep === 7) {
                    this.addOrUpdateSetInfo({
                        agreement: this.$refs.serviceAgreementFormRef.getUeContent(),
                        ...this.editSettingInfo,
                    })
                    return true;
                }
                let refStrArr = [
                    'baseInfoFormRef',
                    'serviceInfoFormRef',
                    'domainInfoFormRef',
                    'gatheringInfoFormRef',
                    'alipayInfoFormRef',
                    'contractDataFormRef',
                    'wechatInfoFormRef',
                ]
                let refStr = refStrArr[this.currStep];
                this.$refs[refStr].$refs.formRef.validate((valid) => {
                    if (valid) {
                        this.editSettingInfo = {
                            ...this.editSettingInfo,
                            ...(this.$refs[refStr].formData || {})
                        }
                        this.currStep = this.currStep + 1
                        this.$nextTick(() => {
                            this[this.initFuncNameArr[this.currStep]]()
                        })
                    }
                })
            },
            addOrUpdateSetInfo(params) {
                let url = this.agentSetId ? `agent/set/updateBasicInfo` : `agent/set/add`
                this.$http({
                    url: this.$http.adornUrl(url),
                    method: 'post',
                    data: {
                        token: this.$cookie.get('token'),
                        ...params,
                        agentSetId: this.agentSetId
                    }
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.agentSetId = data.data || this.agentSetId
                        this.isView = true
                        this.getBasicInfo((data) => {
                            const { agentSetInfo } = data
                            this.allSettingInfo = {
                                ...this.allSettingInfo,
                                ...(agentSetInfo || {}),
                                browserRightDisplay: (agentSetInfo && agentSetInfo.browserRightDisplay) ? 1 : 0
                            }
                            this.$refs.detailRef.init(this.allSettingInfo)
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            initBaseInfoForm() {
                const { apiDomain, agentId, agentName, agentLogo, agentIcon, deputySignature, companyChop, smsSignature, domain, siteName, seoKeywords, seoDescription, la51Src, baiduSrc, baiduocpcToken } = this.allSettingInfo
                this.$refs.baseInfoFormRef.init({
                    agentId: this.editSettingInfo.agentId || agentId,
                    agentName: this.editSettingInfo.agentName || agentName,
                    agentLogo: this.editSettingInfo.agentLogo || agentLogo,
                    agentIcon: this.editSettingInfo.agentIcon || agentIcon,
                    deputySignature: this.editSettingInfo.deputySignature || deputySignature,
                    companyChop: this.editSettingInfo.companyChop || companyChop,
                    smsSignature: this.editSettingInfo.smsSignature || smsSignature,
                    domain: this.editSettingInfo.domain || domain,
                    siteName: this.editSettingInfo.siteName || siteName,
                    seoKeywords: this.editSettingInfo.seoKeywords || seoKeywords,
                    seoDescription: this.editSettingInfo.seoDescription || seoDescription,
                    la51Src: this.editSettingInfo.la51Src || la51Src,
                    baiduSrc: this.editSettingInfo.baiduSrc || baiduSrc,
                    baiduocpcToken: this.editSettingInfo.baiduocpcToken || baiduocpcToken,
                    apiDomain: this.editSettingInfo.apiDomain || apiDomain,
                })
            },
            initServiceInfoForm() {
                const { browserRightDisplay, kefuNickname, hotline, qq, businessCode, wechatQrcode, maintainerPhone, maintainerQq, maintainerNickname, maintainerWechatQrcode } = this.allSettingInfo
                this.$refs.serviceInfoFormRef.init({
                    browserRightDisplay: (this.editSettingInfo.browserRightDisplay || this.editSettingInfo.browserRightDisplay === 0) ? this.editSettingInfo.browserRightDisplay : browserRightDisplay,
                    kefuNickname: this.editSettingInfo.kefuNickname || kefuNickname,
                    hotline: this.editSettingInfo.hotline || hotline,
                    qq: this.editSettingInfo.qq || qq,
                    businessCode: this.editSettingInfo.businessCode || businessCode,
                    wechatQrcode: this.editSettingInfo.wechatQrcode || wechatQrcode,
                    maintainerPhone: this.editSettingInfo.maintainerPhone || maintainerPhone,
                    maintainerQq: this.editSettingInfo.maintainerQq || maintainerQq,
                    maintainerNickname: this.editSettingInfo.maintainerNickname || maintainerNickname,
                    maintainerWechatQrcode: this.editSettingInfo.maintainerWechatQrcode || maintainerWechatQrcode,
                })
            },
            initDomainInfoForm() {
                const { domainCopyright, domainCompanyAddress, domainContactWay, telecomCertification, icp, publicSecurityFiling, onlineBlUrl } = this.allSettingInfo
                this.$refs.domainInfoFormRef.init({
                    domainCopyright: this.editSettingInfo.domainCopyright || domainCopyright,
                    domainCompanyAddress: this.editSettingInfo.domainCompanyAddress || domainCompanyAddress,
                    domainContactWay: this.editSettingInfo.domainContactWay || domainContactWay,
                    telecomCertification: this.editSettingInfo.telecomCertification || telecomCertification,
                    icp: this.editSettingInfo.icp || icp,
                    publicSecurityFiling: this.editSettingInfo.publicSecurityFiling || publicSecurityFiling,
                    onlineBlUrl: this.editSettingInfo.onlineBlUrl || onlineBlUrl,
                })
            },
            initGatheringInfoForm() {
                const { payeePublic, payBankPublic, payAccountPublic, payeePrivate, payBankPrivate, payAccountPrivate, payeeWechat, payQrcodeWechat, payAccountWechat, payeeAlipay, payQrcodeAlipay, payAccountAlipay } = this.allSettingInfo
                this.$refs.gatheringInfoFormRef.init({
                    payeePublic: this.editSettingInfo.payeePublic || payeePublic,
                    payBankPublic: this.editSettingInfo.payBankPublic || payBankPublic,
                    payAccountPublic: this.editSettingInfo.payAccountPublic || payAccountPublic,
                    payeePrivate: this.editSettingInfo.payeePrivate || payeePrivate,
                    payBankPrivate: this.editSettingInfo.payBankPrivate || payBankPrivate,
                    payAccountPrivate: this.editSettingInfo.payAccountPrivate || payAccountPrivate,
                    payeeWechat: this.editSettingInfo.payeeWechat || payeeWechat,
                    payQrcodeWechat: this.editSettingInfo.payQrcodeWechat || payQrcodeWechat,
                    payAccountWechat: this.editSettingInfo.payAccountWechat || payAccountWechat,
                    payeeAlipay: this.editSettingInfo.payeeAlipay || payeeAlipay,
                    payQrcodeAlipay: this.editSettingInfo.payQrcodeAlipay || payQrcodeAlipay,
                    payAccountAlipay: this.editSettingInfo.payAccountAlipay || payAccountAlipay,
                })
            },
            initAlipayInfoForm() {
                const { alipayAppid, alipayGateway, alipayNotify, alipayPublicKey, applicationPrivateKey } = this.allSettingInfo
                this.$refs.alipayInfoFormRef.init({
                    alipayAppid: this.editSettingInfo.alipayAppid || alipayAppid,
                    alipayGateway: this.editSettingInfo.alipayGateway || alipayGateway,
                    alipayNotify: this.editSettingInfo.alipayNotify || alipayNotify,
                    alipayPublicKey: this.editSettingInfo.alipayPublicKey || alipayPublicKey,
                    applicationPrivateKey: this.editSettingInfo.applicationPrivateKey || applicationPrivateKey,
                })
            },
            initContractDataForm() {
                const { contactCompanyName, contactCompanyAddress, contactCompanyAccount, contactCompanyBank, contactPostcode, contactPhone } = this.allSettingInfo
                this.$refs.contractDataFormRef.init({
                    contactCompanyName: this.editSettingInfo.contactCompanyName || contactCompanyName,
                    contactCompanyAddress: this.editSettingInfo.contactCompanyAddress || contactCompanyAddress,
                    contactCompanyAccount: this.editSettingInfo.contactCompanyAccount || contactCompanyAccount,
                    contactCompanyBank: this.editSettingInfo.contactCompanyBank || contactCompanyBank,
                    contactPostcode: this.editSettingInfo.contactPostcode || contactPostcode,
                    contactPhone: this.editSettingInfo.contactPhone || contactPhone,
                })
            },
            initWechatInfoForm() {
                const { wechatGateway, wechatpayNotify, wechatAppid, wechatMchid, wechatKey, wechatAppsecret } = this.allSettingInfo
                this.$refs.wechatInfoFormRef.init({
                    wechatGateway: this.editSettingInfo.wechatGateway || wechatGateway,
                    wechatpayNotify: this.editSettingInfo.wechatpayNotify || wechatpayNotify,
                    wechatAppid: this.editSettingInfo.wechatAppid || wechatAppid,
                    wechatMchid: this.editSettingInfo.wechatMchid || wechatMchid,
                    wechatKey: this.editSettingInfo.wechatKey || wechatKey,
                    wechatAppsecret: this.editSettingInfo.wechatAppsecret || wechatAppsecret,
                })
            },
            initServiceAgreementForm() {
                const { agreement } = this.allSettingInfo
                this.$refs.serviceAgreementFormRef.init({
                    agreement: this.editSettingInfo.agreement || agreement,
                })
            },
            handleEdit() {
                this.isView = false;
                this.currStep = 0
                this.editSettingInfo = {}
                this.$nextTick(() => {
                    this.initBaseInfoForm()
                })
            }
        }
    };

</script>
<style lang="scss" scoped>
    .footer {
        display: flex;
        align-items: center;
        margin-top: 20px;
        padding: 0px 30px 20px;
        justify-content: center;
    }

    .el-dialog {
        width: 55% !important;
        min-width: 750px;
    }

    .settingSteps {
        width: 80%;
        margin: 0 auto;
        padding-top: 20px;
    }

    .settingSteps .el-step__head.is-process,
    .settingSteps .is-success,
    .settingSteps .is-process,
    .settingSteps .el-step__head.is-finish {
        color: #3e8ef7;
        border-color: #3e8ef7;
    }

    .form-wrapper {
        min-width: 350px;
        min-height: 500px;
        margin: 0 auto;
        width: 80%;
        >.el-form {
            padding: 50px 0px 30px;
        }
    }
    .main {
        background-color: #fff;
        padding: 30px;
    }
    .view-wrapper {
        position: relative;
        padding-top: 60px;
        .edit-btn {
            position: absolute;
            top: 0px;
            right: 0px;
        }
    }
</style>