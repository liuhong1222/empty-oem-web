<template>
    <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="150px"
    >
        <el-form-item label="支付宝应用ID：" prop="alipayAppid">
            <el-input v-model="formData.alipayAppid" placeholder="请输入支付宝应用ID">
            </el-input>
        </el-form-item>
        <el-form-item label="支付宝网关地址：" prop="alipayGateway">
            <el-input v-model="formData.alipayGateway" placeholder="请输入支付宝网关地址">
            </el-input>
        </el-form-item>
        <el-form-item label="支付回调地址：" prop="alipayNotify">
            <el-input v-model="formData.alipayNotify" placeholder="请输入支付回调地址">
            </el-input>
        </el-form-item>
        <el-form-item label="支付宝公钥：" prop="alipayPublicKey">
            <el-input type="textarea" :rows="5" v-model="formData.alipayPublicKey" placeholder="请输入支付宝公钥">
            </el-input>
        </el-form-item>
        <el-form-item label="应用私钥：" prop="applicationPrivateKey">
            <el-input type="textarea" :rows="5" v-model="formData.applicationPrivateKey" placeholder="请输入应用私钥">
            </el-input>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: "AlipayInfo",
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