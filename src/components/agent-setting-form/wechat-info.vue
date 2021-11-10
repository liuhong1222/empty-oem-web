<template>
    <el-form
        :inline="true"
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="110px"
    >
        <el-form-item label="微信网关地址：" prop="wechatGateway">
            <el-input v-model="formData.wechatGateway" placeholder="请输入微信网关地址">
            </el-input>
        </el-form-item>
        <el-form-item label="微信支付回调地址：" prop="wechatpayNotify">
            <el-input v-model="formData.wechatpayNotify" placeholder="请输入微信支付回调地址">
            </el-input>
        </el-form-item>
        <el-form-item label="微信应用ID：" prop="wechatAppid">
            <el-input v-model="formData.wechatAppid" placeholder="请输入微信应用ID">
            </el-input>
        </el-form-item>
        <el-form-item label="微信mchid：" prop="wechatMchid">
            <el-input v-model="formData.wechatMchid" placeholder="请输入微信mchid">
            </el-input>
        </el-form-item>
        <el-form-item label="微信key：" prop="wechatKey">
            <el-input v-model="formData.wechatKey" placeholder="请输入微信key">
            </el-input>
        </el-form-item>
        <el-form-item label="微信秘钥：" prop="wechatAppsecret">
            <el-input type="textarea" :rows="5" v-model="formData.wechatAppsecret" placeholder="请输入微信秘钥">
            </el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import imgUrl from '@/utils/imgUrl'
export default {
    name: "WechatInfo",
    data() {
        return {
            formData: {},
            rules: {
            },
        };
    },
    methods: {
        init(initData) {
            this.formData = {
                ...initData
            }
        },
    },
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

    .essentialInformation,
    .domainNameFiling,
    .customerInformation,
    .contractInformation,
    .alipayIInformation,
    .weixinLoginInfo,
    .weixinInformation {
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