<template>
    <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="180px"
    >
        <el-form-item label="域名版权信息：" prop="domainCopyright">
            <el-input v-model="formData.domainCopyright" placeholder="请输入域名版权信息">
            </el-input>
        </el-form-item>
        <el-form-item label="公司地址：" prop="domainCompanyAddress">
            <el-input v-model="formData.domainCompanyAddress" placeholder="请输入公司地址">
            </el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="domainContactWay">
            <el-input v-model="formData.domainContactWay" placeholder="请输入联系方式">
            </el-input>
        </el-form-item>
        <el-form-item label="增值电信业务经营许可证：" prop="telecomCertification">
            <el-input v-model="formData.telecomCertification" placeholder="请输入增值电信业务经营许可证">
            </el-input>
        </el-form-item>
        <el-form-item label="ICP备案：" prop="icp">
            <el-input v-model="formData.icp" placeholder="请输入ICP备案">
            </el-input>
        </el-form-item>
        <el-form-item label="公安备案：" prop="publicSecurityFiling">
            <el-input v-model="formData.publicSecurityFiling" placeholder="请输入公安备案">
            </el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import imgUrl from '@/utils/imgUrl'
export default {
    name: "DomainInfo",
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