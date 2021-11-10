<template>
    <el-form
        :model="formData"
        :rules="rules"
        label-width="180px"
        ref="formRef"
    >
        <el-form-item label="合同资料公司名称：" prop="contactCompanyName">
            <el-input v-model="formData.contactCompanyName" placeholder="请输入合同资料公司名称">
            </el-input>
        </el-form-item>
        <el-form-item label="合同资料公司地址：" prop="contactCompanyAddress">
            <el-input v-model="formData.contactCompanyAddress" placeholder="请输入合同资料公司地址">
            </el-input>
        </el-form-item>
        <el-form-item label="合同资料公司账户：" prop="contactCompanyAccount">
            <el-input v-model="formData.contactCompanyAccount" placeholder="请输入合同资料公司账户">
            </el-input>
        </el-form-item>
        <el-form-item label="合同资料公司开户行：" prop="contactCompanyBank">
            <el-input v-model="formData.contactCompanyBank" placeholder="请输入合同资料公司开户行">
            </el-input>
        </el-form-item>
        <el-form-item label="合同资料邮编：" prop="contactPostcode">
            <el-input v-model="formData.contactPostcode" placeholder="请输入合同资料邮编">
            </el-input>
        </el-form-item>
        <el-form-item label="合同资料电话：" prop="contactPhone">
            <el-input v-model="formData.contactPhone" placeholder="请输入合同资料电话">
            </el-input>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: "ContractData",
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