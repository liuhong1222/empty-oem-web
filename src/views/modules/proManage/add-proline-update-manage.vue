<template>
    <div>
        <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="proLineAUDataForm" :rules="proLineAUDataRules" ref="proLineAUDataForm" label-width="110px"
                class="demo-ruleForm">
                <el-form-item label="产品线名称：" prop="proLineName">
                    <el-input v-model="proLineAUDataForm.proLineName" maxLength="6"></el-input>
                    <p>注：为保持官网界面美观，建议您最多创建三条产品线，每个产品线名称最长为6个字</p>
                </el-form-item>
                <el-form-item label="icon" id="iconImgSize" prop="imageUrlIcon">
                    <el-upload class="upload-demo" drag :show-file-list="true" :on-success="handleAvatarSuccessIcon"
                        :on-progress="onProgressIcon" :before-upload="beforeAvatarUploadIcon" :action="actionIcon()"
                        :data="iconQueryParams" :on-error="errorIcon" ref="upload">
                        <img v-if="proLineAUDataForm.imageUrlIcon" :src="proLineAUDataForm.imageUrlIcon" class="avatar"
                            :limit="1">
                        <i class="el-icon-plus"></i>
                        <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长22px，宽22px，（再次上传请删除上一次上传）</div>
                        <input type="hidden" v-model="proLineAUDataForm.imageUrlIcon" />
                    </el-upload>
                </el-form-item><br />
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="proLineAUDataForm.status" placeholder="请选择审核状态">
                        <el-option v-for="item in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="orderNum">
                    <el-input-number v-model="proLineAUDataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain @click="closeNewsSeeDialod">取消</el-button>
                    <el-button type="primary" @click="proLineAUSubmit()">提交审核</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import imgUrl from '@/utils/imgUrl'
    export default {
        data() {
            return {
                visible: false,
                title: '',
                iconUrl: '',
                proLineAUDataForm: {
                    proLineName: '',
                    status: '0',
                    orderNum: '',
                    id: '',
                    imageUrlIcon: '',
                },
                proLineAUDataRules: {
                    imageUrlIcon: [
                        { required: true, message: '请输入上传产品线icon', trigger: 'focus' }
                    ],
                    proLineName: [
                        { required: true, message: '请输入产品线名称', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    orderNum: [
                        { required: true, message: '请输入排序号', trigger: 'blur' }
                    ],
                },
                statusArr: [
                    { label: '上架', value: 0 },
                    { label: '下架', value: 1 }
                ],
                iconQueryParams: { //icon上传参数
                    imageType: 7,
                    agentId: null,
                    file: null
                },
            }
        },
        methods: {
            showInit(row) {
                if (row) {
                    this.proLineAUDataForm.id = row.id
                }
                if (this.$refs['proLineAUDataForm'] !== undefined) {
                    this.$refs['proLineAUDataForm'].resetFields()
                }
                this.visible = true;
                this.proLineAUDataForm.imageUrlIcon = ""
                // 设置默认值
                if (this.proLineAUDataForm.status == 0) {
                    this.proLineAUDataForm.status = '上架'
                }

                if (this.proLineAUDataForm.id) {
                    this.title = '编辑'
                    // alert('编辑')
                    this.proLineAUDataForm.proLineName = row.product_type_name
                    this.proLineAUDataForm.orderNum = row.order_num
                    this.proLineAUDataForm.status = row.shelf_status == 0 ? '上架' : '下架'
                    if (row.icon_path) {
                        this.proLineAUDataForm.imageUrlIcon = imgUrl.imgUrl + row.icon_path;

                    }

                } else {
                    this.title = '添加'
                    this.proLineAUDataForm.proLineName = ""
                    this.proLineAUDataForm.orderNum = 0
                    this.proLineAUDataForm.status = '上架'
                    this.proLineAUDataForm.imageUrlIcon = ""
                }
            },
            proLineAUSubmit() {
                // console.log(this.proLineAUDataForm.status)
                this.$refs['proLineAUDataForm'].validate((valid) => {
                    if (valid) {
                        let status = this.proLineAUDataForm.status;
                        status == "上架" ? (status = 0) : (status == "下架" ? (status = 1) : status);
                        // console.log(status)
                        this.$http({
                            url: this.$http.adornUrl(`agent/line/saveOrUpdate?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'id': this.proLineAUDataForm.id,
                                'productLineName': this.proLineAUDataForm.proLineName,
                                'orderNum': this.proLineAUDataForm.orderNum,
                                'status': status,
                                'iconPath': this.iconUrl,
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.$message.success('成功')
                                this.visible = false;
                                this.$refs.upload.clearFiles()
                                this.$emit('refreshNewsList')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            closeNewsSeeDialod() {
                this.visible = false;
                this.proLineAUDataForm.id = ""
                this.$refs.upload.clearFiles()
            },
            // 上传icon
            actionIcon() {

                let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}&imageType=7`);
                return url;
            },
            errorIcon() {
                this.$refs.upload.clearFiles()
                console.log("yyyyyy");
            },
            onProgressIcon() {
                console.log("上传中");
            },
            beforeAvatarUploadIcon(file) {
                const isJPG = (file.type == 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error("上传icon图片只能是背景透明的 png 格式!");
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error("上传icon图片大小不能超过 2MB!");
                    return false;
                }
                var _this = this;
                const imgSize = new Promise(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var image = new Image();
                        image.onload = function () {
                            var width = this.width;
                            var height = this.height;
                            if (width !== 22) {
                                _this.$alert('图片长必须为22!', '提示', { confirmButtonText: '确定' });
                                reject();
                            }
                            if (height !== 22) {
                                _this.$alert('图片宽必须为22!', '提示', { confirmButtonText: '确定' });
                                reject();
                            }
                            resolve();
                        };
                        image.src = event.target.result;
                    }
                    reader.readAsDataURL(file);
                });

                return isJPG && isLt2M && imgSize;
            },
            handleAvatarSuccessIcon(res, file) {
                this.iconUrl = res.data.licenseUrl
                this.proLineAUDataForm.imageUrlIcon = URL.createObjectURL(file.raw);

            },
        }
    }

</script>

<style>
    #iconImgSize .el-upload-dragger {
        width: 22px;
        height: 22px;
    }

    #iconImgSize .el-upload-dragger {
        width: 22px;
        height: 22px;
        font-size: 24px;
        line-height: 22px;
    }

    #iconImgSize .el-upload-dragger .avatar {
        width: 22px;
        height: 22px;
    }
</style>