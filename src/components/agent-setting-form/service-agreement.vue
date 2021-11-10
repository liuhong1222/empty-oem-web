<template>
    <el-form
        :model="formData"
        :rules="rules"
        label-width="150px"
        ref="formRef"
    >
        <el-form-item label="服务协议：" prop="agreement">
            <el-input type="hidden" v-model="formData.agreement"></el-input>
            <UE :defaultMsg="defaultEditorCon" :config="config" ref="ue"></UE>
        </el-form-item>
    </el-form>
</template>

<script>
import UE from '../ue/ue6.vue';
export default {
    name: "ServiceAgreement",
    components: { UE },
    data() {
        return {
            formData: {},
            rules: {
            },
            defaultEditorCon: '',
            config: {
                initialFrameWidth: '100%',
                initialFrameHeight: 350,
                autoFloatEnabled: false,
                elementPathEnabled: false,
            },
        };
    },
    methods: {
        init(initData) {
            this.formData = {
                ...initData
            }
            this.defaultEditorCon = initData.agreement || ''
        },
        getUeContent() {
            let content = ''
            if (this.$refs.ue.hasContent) {   //判断是否有内容
                // this.$refs.ue.getUEContentMsj() 带格式内容
                // this.$refs.ue.getContentTxtMsj() 纯文本内容
                content = this.$refs.ue.getUEContentMsj()
            }
            return content
        }
    },
};
</script>

<style lang="scss" scoped>
</style>