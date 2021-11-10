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
        <div class="view-wrapper">

        </div>
    </div>
</template>

<script>
    import imgUrl from '@/utils/imgUrl'
    import BaseInfoForm from '@/components/agent-setting-form/base-info.vue'
    import ServiceInfoForm from '@/components/agent-setting-form/service-info.vue'
    import DomainInfoForm from '@/components/agent-setting-form/domain-info.vue'
    import GatheringInfoForm from '@/components/agent-setting-form/gathering-info.vue'
    import AlipayInfoForm from '@/components/agent-setting-form/alipay-info.vue'
    import ContractDataForm from '@/components/agent-setting-form/contract-data.vue'
    import WechatInfoForm from '@/components/agent-setting-form/wechat-info.vue'
    import ServiceAgreementForm from '@/components/agent-setting-form/service-agreement.vue'
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
        },
        data() {
            return {
                isView: false,
                allSettingInfo: {}, // 所有的代理商设置信息
                currStep: 0,
            }
        },
        activated() {
            this.getBasicInfo()
        },
        methods: {
            getBasicInfo() {
                let agentInfo = this.$json.parse(sessionStorage.getItem('agentInfo') || '{}')
                this.allSettingInfo = {
                    agentId: agentInfo.id + '',
                    agentName: agentInfo.companyName
                }
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findBasicInfo?token=${this.$cookie.get('token')}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.allSettingInfo = {
                            ...this.allSettingInfo,
                            ...(data.data || {})
                        }
                        this.initBaseInfoForm()
                    }
                })
            },
            handlePre() {
                if (this.currStep === 0) {
                    this.isView = true
                    return true
                }
                let funcNameArr = [
                    'initBaseInfoForm',
                    'initServiceInfoForm',
                    'initDomainInfoForm',
                    'initGatheringInfoForm',
                    'initAlipayInfoForm',
                    'initContractDataForm',
                    'initWechatInfoForm',
                    'initServiceAgreementForm',
                ]
                this.currStep = this.currStep - 1
                this[funcNameArr[this.currStep]]()
            },
            handleNext() {
                if (this.currStep === 7) {
                    this.handleSubmitFormData('serviceAgreementFormRef', () => {
                    this.isView = true
                })
                    return true;
                }
                let funcNameArr = [
                    'initServiceInfoForm',
                    'initDomainInfoForm',
                    'initGatheringInfoForm',
                    'initAlipayInfoForm',
                    'initContractDataForm',
                    'initWechatInfoForm',
                    'initServiceAgreementForm',
                ]
                let refStrArr = [
                    'baseInfoFormRef',
                    'serviceInfoFormRef',
                    'domainInfoFormRef',
                    'gatheringInfoFormRef',
                    'alipayInfoFormRef',
                    'contractDataFormRef',
                    'wechatInfoFormRef',
                ]
                this.handleSubmitFormData(refStrArr[this.currStep], () => {
                    this[funcNameArr[this.currStep]]()
                    this.currStep = this.currStep + 1
                })
            },
            initBaseInfoForm() {
                const { agentId, agentName, agentLogo, agentIcon, deputySignature, companyChop, smsSignature, domain } = this.allSettingInfo
                this.$refs.baseInfoFormRef.init({
                    agentId,
                    agentName,
                    agentLogo,
                    agentIcon,
                    deputySignature,
                    companyChop,
                    smsSignature,
                    domain,
                })
            },
            initServiceInfoForm() {
                const { browserRightDisplay, kefuNickname, hotline, qq, businessCode, wechatQrcode, maintainerPhone, maintainerQq, maintainerNickname, maintainerWechatQrcode } = this.allSettingInfo
                this.$refs.serviceInfoFormRef.init({
                    browserRightDisplay,
                    kefuNickname,
                    hotline,
                    qq,
                    businessCode,
                    wechatQrcode,
                    maintainerPhone,
                    maintainerQq,
                    maintainerNickname,
                    maintainerWechatQrcode,
                })
            },
            initDomainInfoForm() {
                const { domainCopyright, domainCompanyAddress, domainContactWay, telecomCertification, icp, publicSecurityFiling } = this.allSettingInfo
                this.$refs.domainInfoFormRef.init({
                    domainCopyright,
                    domainCompanyAddress,
                    domainContactWay,
                    telecomCertification,
                    icp,
                    publicSecurityFiling,
                })
            },
            initGatheringInfoForm() {
                const { payeePublic, payBankPublic, payAccountPublic, payeePrivate, payBankPrivate, payAccountPrivate, payeeWechat, payQrcodeWechat, payAccountWechat, payeeAlipay, payQrcodeAlipay, payAccountAlipay } = this.allSettingInfo
                this.$refs.gatheringInfoFormRef.init({
                    payeePublic,
                    payBankPublic,
                    payAccountPublic,
                    payeePrivate,
                    payBankPrivate,
                    payAccountPrivate,
                    payeeWechat,
                    payQrcodeWechat,
                    payAccountWechat,
                    payeeAlipay,
                    payQrcodeAlipay,
                    payAccountAlipay
                })
            },
            initAlipayInfoForm() {
                const { alipayAppid, alipayGateway, alipayNotify, alipayPublicKey, applicationPrivateKey } = this.allSettingInfo
                this.$refs.alipayInfoFormRef.init({
                    alipayAppid,
                    alipayGateway,
                    alipayNotify,
                    alipayPublicKey,
                    applicationPrivateKey,
                })
            },
            initContractDataForm() {
                const { contactCompanyName, contactCompanyAddress, contactCompanyAccount, contactCompanyBank, contactPostcode, contactPhone } = this.allSettingInfo
                this.$refs.contractDataFormRef.init({
                    contactCompanyName,
                    contactCompanyAddress,
                    contactCompanyAccount,
                    contactCompanyBank,
                    contactPostcode,
                    contactPhone,
                })
            },
            initWechatInfoForm() {
                const { wechatGateway, wechatpayNotify, wechatAppid, wechatMchid, wechatKey, wechatAppsecret } = this.allSettingInfo
                this.$refs.wechatInfoFormRef.init({
                    wechatGateway,
                    wechatpayNotify,
                    wechatAppid,
                    wechatMchid,
                    wechatKey,
                    wechatAppsecret,
                })
            },
            initServiceAgreementForm() {
                const { agreement } = this.allSettingInfo
                this.$refs.serviceAgreementFormRef.init({
                    agreement
                })
            },
            handleSubmitFormData(refStr, callback) {
                this.$refs[refStr].$refs.formRef.validate((valid) => {
                    if (valid) {
                        let formData = this.$refs[refStr].formData || {}
                        this.$http({
                            url: this.$http.adornUrl(`agent/set/add`),
                            method: 'post',
                            params: this.$http.adornParams({
                                token: this.$cookie.get('token'),
                                ...formData
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.allSettingInfo = {
                                    ...this.allSettingInfo,
                                    ...formData
                                }
                                this.$nextTick(() => {
                                    callback()
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
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
</style>