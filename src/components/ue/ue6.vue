<template>
    <div>
        <script id="editor6" type="text/plain"></script>
        <!-- <span>{{defaultMsg}}</span> -->
    </div>
</template>
<script>
    export default {
        name: 'UE',
        data() {
            return {
                editor6: null,
                newsCon: '',
            }
        },
        props: {
            defaultMsg: {
                type: String,
            },
            config: {
                type: Object,
            }
        },

        mounted() {
            const _this = this;
            this.editor6 = UE.getEditor('editor6', this.config);
            this.editor6.addListener("ready", function () {
                _this.editor6.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            });
        },
        watch: {
            defaultMsg(nv) {
                if (nv) {
                    // debugger
                    // console.log(nv)
                    this.editor6 = UE.getEditor('editor6', this.config);
                    this.editor6.setContent(nv); // 放入内容。
                }
            }
        },
        methods: {

            getUEContentMsj() { // 获取内容方法
                return this.editor6.getContent()
            },
            getContentTxtMsj() {
                return this.editor6.getContentTxt()
            },
            execCommand() {   //清空内容
                return this.editor6.execCommand('cleardoc');
            },
            hasContent() {
                return this.editor6.hasContent()
            }
        },
        destroyed() {
            return this.editor6.destroy();
        }
    }
</script>