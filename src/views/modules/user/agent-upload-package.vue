<template>
    <el-dialog :destroy-on-close="true" width="600px" :title="'号码魔方上传'" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" :label-position="labelPosition" label-width="123px" class="cf">
            <el-form-item label="文件类型：" prop="fileType">
                <el-select v-model="dataForm.fileType" placeholder="请选择文件类型">
                    <el-option label="国内号码魔方" value="national"></el-option>
                    <el-option label="国际号码魔方" value="international"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传文件：" prop="file">
                <el-upload
                    :key="uploadKey"
                    :action="''"
                    :before-upload="beforeUpload"
                    name="file"
                    enctype="multipart/form-data"
                    :multiple="false"
                    :show-file-list="false"
                    ref="uploadRef"
                >
                    <div class="upload-inner-box">
                        <el-button type="primary">点击上传</el-button>
                        <span :title="dataForm.file ? dataForm.file.name : ''">{{ dataForm.file ? dataForm.file.name : '' }}</span>
                    </div>
                    <input type="hidden" v-model="dataForm.file" />
                </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
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
                    file: undefined,
                    fileType: undefined
                },
                dataRule: {
                    file: [
                        { required: true, message: '请上传文件', trigger: 'change' }
                    ],
                    fileType: [
                        { required: true, message: '请选择文件类型', trigger: 'change' }
                    ],
                },
                uploadKey: +(new Date()) + '',
                agentId: undefined,
                loading: false,
            }
        },
        methods: {
            init(record) {
                this.dialogVisible = true
                this.uploadKey = +(new Date()) + ''
                this.$nextTick(() => {
                    this.$refs.dataFormRef.resetFields()
                    this.dataForm = {
                        file: undefined,
                        fileType: undefined,
                    }
                    this.agentId = record.agentId + ''
                })
            },
            beforeUpload(file) {
                this.dataForm.file = file
                return false
            },
            handleCancel() {
                this.dialogVisible = false
            },
            handleSubmit() {
                this.$refs.dataFormRef.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        let formData = new FormData();
                        formData.append('agentId', this.agentId)
                        formData.append('file', this.dataForm.file)
                        formData.append('fileType', this.dataForm.fileType)
                        this.$http({
                            url: this.$http.adornUrl(`agent/agentInfo/uploadMobileCube?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            data: formData
                        }).then(({ data }) => {
                            this.loading = false
                            if (data && data.code === 0) {
                                this.dialogVisible = false
                                this.$message.success('上传成功')
                                this.$emit('refreshDataList')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            }
        }
    }

</script>

<style lang="scss" scoped>
.upload-inner-box {
    width: 377px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    > span {
        display: inline-block;
        flex: auto;
        width: 200px;
        text-align: left;
        height: 40px;
        overflow: hidden;
        line-height: 40px;
        margin-left: 8px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
<style lang="scss">
    .el-form-item__content {
        margin-left: 0
    }
</style>