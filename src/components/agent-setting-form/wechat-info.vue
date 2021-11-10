<template>
    <el-form
        :model="formData"
        :rules="rules"
        label-width="150px"
        ref="formRef"
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
</style>