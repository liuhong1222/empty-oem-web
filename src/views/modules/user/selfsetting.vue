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
                    <service-infoo-form ref="serviceInfoFormRef" />
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
            </div>
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
                this.allSettingInfo = {}
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findBasicInfo?token=${this.$cookie.get('token')}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.allSettingInfo = data.data || {}
                    }
                })
            },

        }
    };

</script>
<style lang="scss" scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .el-dialog {
        width: 55% !important;
        min-width: 750px;
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

        >.el-form {
            padding: 30px 30px;
        }
    }

    .el-upload-dragger {
        width: 174px;
        height: 182px;
    }

    .main {
        background-color: #fff;
        padding-top: 35px
    }

    .main .noborder .el-input__inner {
        border: none
    }

    .seeBasic .el-collapse-item__header {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 20px;
        margin-left: 20px
    }

    .seeBasic .el-input__inner,
    .seeBasic .el-textarea__inner {
        border: none
    }

    .seeBasic .el-collapse-item__wrap {
        padding-left: 20px
    }

    #iconImgSize .el-upload-dragger {
        width: 40px;
        height: 40px;
        font-size: 24px;
        line-height: 40px;
    }

    #iconImgSize .el-upload-dragger .avatar {
        width: 40px;
        height: 40px;
    }

    #logoImgSize .el-upload-dragger {
        width: 150px;
        height: 50px;
        line-height: 50px;
        font-size: 24px;
    }

    #logoImgSize .el-upload-dragger .avatar {
        width: 150px;
        height: 50px;
    }

    .el-upload-dragger {
        width: 174px;
        height: 182px;
        font-size: 24px;
        color: #999;
        line-height: 182px;
    }

    #logoseeImg .el-upload,
    #logoseeImg .el-upload .avatar {
        width: 150px;
        height: 50px;
    }

    #iconseeImg .el-upload,
    #iconseeImg .el-upload .avatar {
        width: 40px;
        height: 40px;
    }

    .delWXimg {
        position: absolute;
        left: 190px;
        top: 79px;
        z-index: 999;
    }

    .delWXimg img {
        vertical-align: text-top !important;
        cursor: pointer;
    }
</style>