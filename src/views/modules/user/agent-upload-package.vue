<template>
    <el-dialog :destroy-on-close="true" width="600px" :title="'号码魔方上传'" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" :label-position="labelPosition" label-width="123px" class="cf">
            <el-form-item label="上传文件：" prop="file">
                <el-upload
                    :key="uploadKey"
                    :action="onUploadAction()"
                    :on-success="handleUploadSuccess"
                    :on-error="onUploadError"
                    :on-progress="onUploadProgress"
                    :data="uploadQueryParams"
                    name="file"
                    enctype="multipart/form-data"
                    :limit="1"
                    ref="uploadRef"
                >
                    <div>
                        <el-button type="primary">点击上传</el-button>
                        <span>（请先移除前一个文件再选择文件）</span>
                    </div>
                </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit()">上传完成</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                labelPosition: 'right',
                dataForm: {
                    file: undefined
                },
                dataRule: {
                    file: [
                        { required: true, message: '请上传文件', trigger: 'change' }
                    ],
                },
                uploadQueryParams: {},
                uploadKey: +(new Date()) + ''
            }
        },
        methods: {
            init(record) {
                this.dialogVisible = true
                this.uploadKey = +(new Date()) + ''
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    this.dataForm = {
                        file: undefined,
                    }
                    this.uploadQueryParams = {
                        agentId: record.id + ''
                    }
                })
            },
            onUploadAction() {
                let url = this.$http.adornUrl(`agent/agentInfo/uploadMobileCube?token=${this.$cookie.get('token')}`);
                return url;
            },
            onUploadProgress() {
                console.log("上传中");
            },
            onUploadError() {
                console.log("上传失败");
                this.$refs.uploadRef.clearFiles()
            },
            handleUploadSuccess(response, file) {
                if (response.code === 0) {
                    this.$message.success('上传成功')
                } else {
                    this.$message.error(response.msg)
                    this.$refs.uploadRef.clearFiles()
                }
            },
            handleSubmit() {
                this.dialogVisible = false
                this.$emit('refreshDataList')
            }
        }
    }

</script>

<style lang="scss">
    .el-form-item__content {
        margin-left: 0
    }
</style>