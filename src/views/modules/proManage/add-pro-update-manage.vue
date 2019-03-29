<template>
    <div>
        <el-dialog :title="!peoAUDataForm.id ? '添加' :'编辑'" :close-on-click-modal="false" :visible.sync="visible" width="850px"
            :before-close="closeNewsSeeDialod">
            <el-form :model="peoAUDataForm" label-width="110px" :rules="peoAUDataRules" ref="peoAUDataRef" class="demo-ruleForm">
                <el-form-item label="产品线名称：" prop="proLineName">
                    <el-input v-model="peoAUDataForm.proLineName" placeholder="请输入产品线名称……" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="产品名称：" prop="proName">
                    <el-input v-model="peoAUDataForm.proName" placeholder="请输入产品名称……"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="describe">
                    <el-input type="textarea" v-model="peoAUDataForm.describe" placeholder="请简要描述下产品,最多输入50个字符……"
                        maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="icon" id="iconImgSize" prop="imageUrlIcon">
                    <el-upload class="upload-demo" drag :show-file-list="true" :on-success="handleAvatarSuccessIcon"
                        :on-progress="onProgressIcon" :before-upload="beforeAvatarUploadIcon" :action="actionIcon()"
                        :data="iconQueryParams" :on-error="errorIcon">
                        <img v-if="peoAUDataForm.imageUrlIcon" :src="peoAUDataForm.imageUrlIcon" class="avatar" :limit="1">
                        <i class="el-icon-plus"></i>
                        <div class="el-upload__tip" slot="tip">要求为背景透明的png格式，且不超过2M，长100px，宽100px，（再次上传请删除上一次上传）</div>
                        <input type="hidden" v-model="peoAUDataForm.imageUrlIcon" />
                    </el-upload>
                </el-form-item><br />
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="peoAUDataForm.status" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="orderNum">
                    <el-input-number v-model="peoAUDataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item label="跳转方式" prop="methods">
                    <el-radio-group v-model="peoAUDataForm.methods" @change="addressTab">
                        <el-radio :label="2">外部地址</el-radio>
                        <el-radio :label="1">内部编辑</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="链接地址：" prop="adress" v-if="addressShow">
                    <el-input v-model="peoAUDataForm.adress" placeholder="请输入您要跳转的地址链接"></el-input>
                </el-form-item>
                <el-form-item label="新闻内容" prop="content" v-if="contentShow">
                    <el-input type="hidden" v-model="peoAUDataForm.content"></el-input>
                    <UE v-bind:defaultMsg="defaultMsgCon" :config=config ref="ue"></UE>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain @click="closeNewsSeeDialod">取消</el-button>
                    <el-button type="primary" @click="peoAUDataSubmit()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import UE from '../../../components/ue/ue4.vue';
    import imgUrl from '@/utils/imgUrl'
    export default {
        components: { UE },
        data() {
            return {
                visible: false,
                disabled: false,
                addressShow: true,
                contentShow: false,
                title: '',
                defaultMsgCon: '',
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    autoFloatEnabled: false,
                    elementPathEnabled: false,
                    // serverUrl: 'http://172.16.4.242:9999/open/agent/ueditor?token=' + `${this.$cookie.get('token')}`
                },
                peoAUDataForm: {
                    proLineName: '',
                    proName: '',
                    describe: '',
                    status: '',
                    orderNum: '',
                    methods: 2,
                    adress: '',
                    imageUrlIcon: '',
                    content: '',
                    id: ''
                },
                peoAUDataRules: {
                    proLineName: [
                        { required: true, message: '请输入产品线名称', trigger: 'blur' }
                    ],
                    proName: [
                        { required: true, message: '请输入产品名称', trigger: 'blur' }
                    ],
                    describe: [
                        { required: true, message: '请输入描述信息', trigger: 'blur' }
                    ],
                    imageUrlIcon: [
                        { required: true, message: '请上传icon', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    orderNum: [
                        { required: true, message: '请输入排序号', trigger: 'blur' }
                    ],
                    methods: [
                        { required: true, message: '请选择跳转方式', trigger: 'blur' }
                    ],
                    adress: [
                        { required: true, message: '请输入链接地址', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输入编辑内容', trigger: 'blur' }
                    ],
                },
                statusArr: [
                    { label: '上架', value: 0 },
                    { label: '下架', value: 1 }
                ],
                iconQueryParams: { //icon上传参数
                    imageType: 4,
                    agentId: null,
                    file: null
                },
            }
        },
        methods: {
            showInit(id) {
                this.visible = true;
                this.disabled = false;
                this.peoAUDataForm.id = id;
                this.peoAUDataForm.methods = 2;
                if (this.peoAUDataForm.methods == 2) {
                    this.addressShow = true;
                    this.contentShow = false;
                } else {
                    this.addressShow = false;
                    this.contentShow = true;
                }
                if (this.peoAUDataForm.id) {
                    this.disabled = true;
                    this.$http({
                        url: this.$http.adornUrl(`agent/product/findById?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'id': this.peoAUDataForm.id
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.peoAUDataForm.proLineName = data.data.productLineName;
                            this.peoAUDataForm.proName = data.data.product_name;
                            this.peoAUDataForm.describe = data.data.product_desc;
                            this.peoAUDataForm.imageUrlIcon = imgUrl.imgUrl + data.data.icon_path;
                            this.peoAUDataForm.status = data.data.shelf_status;
                            this.peoAUDataForm.orderNum = data.data.order_num;
                            this.peoAUDataForm.methods = data.data.jumpMode;
                            this.peoAUDataForm.adress = data.data.link_url;
                            this.defaultMsgCon = data.data.product_content;
                        }
                    })
                }

                this.$nextTick(() => {
                    this.$refs['peoAUDataRef'].resetFields()
                })
                // 设置默认值
                if (this.peoAUDataForm.status == 0) {
                    this.peoAUDataForm.status = '上架'
                }
            },
            peoAUDataSubmit() {
                if (this.$refs.ue) {
                    if (this.$refs.ue.hasContent) {   //判断是否有内容
                        this.peoAUDataForm.content = this.$refs.ue.getUEContentMsj()
                    }
                }
                this.$refs['peoAUDataRef'].validate((valid) => {
                    if (valid) {
                        let status = this.peoAUDataForm.status;
                        status == "上架" ? (status = 0) : (status = status);
                        console.log(status)
                    }
                })
            },
            closeNewsSeeDialod() {
                this.visible = false;
                this.defaultMsgCon = ""
                console.log(this.$refs.ue)
                if (this.$refs.ue) {
                    if (this.$refs.ue.hasContent) {   //判断是否有内容
                        // alert(33333)
                        this.$refs.ue.execCommand()
                    }
                }

            },
            // 上传icon
            actionIcon() {
                let url = this.$http.adornUrl(`file/image/upload?token=${this.$cookie.get('token')}&imageType=7`);
                return url;
            },
            errorIcon() {
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
                            if (width !== 100) {
                                _this.$alert('图片长必须为100!', '提示', { confirmButtonText: '确定' });
                                reject();
                            }
                            if (height !== 100) {
                                _this.$alert('图片宽必须为100!', '提示', { confirmButtonText: '确定' });
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
                this.peoAUDataForm.imageUrlIcon = URL.createObjectURL(file.raw);
            },
            addressTab(val) {
                if (val == 2) {
                    this.addressShow = true;
                    this.contentShow = false;
                } else {
                    this.addressShow = false;
                    this.contentShow = true;
                }
            }
        }
    }
</script>

<style>
    #iconImgSize .el-upload-dragger {
        width: 100px;
        height: 100px;
    }

    #iconImgSize .el-upload-dragger {
        width: 100px;
        height: 100px;
        font-size: 24px;
        line-height: 100px;
    }

    #iconImgSize .el-upload-dragger .avatar {
        width: 100px;
        height: 100px;
    }
</style>