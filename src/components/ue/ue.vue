<template>
    <div>
        <script id="editor" type="text/plain"></script>
        <!-- <span>{{defaultMsg}}</span> -->
    </div>
</template>
<script>
    export default {
        name: 'UE',
        data() {
            return {
                editor: null,
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
            // const _this = this;
            this.editor = UE.getEditor('editor', this.config);
            // this.editor.addListener("ready", function () {
            //     _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            // });
        },
        watch: {
            defaultMsg(nv) {
                if (nv) {
                    // debugger
                    // console.log(nv)
                    this.editor = UE.getEditor('editor', this.config);
                    this.editor.setContent(nv); // 放入内容。
                }
            }
        },
        methods: {

            getUEContentMsj() { // 获取内容方法
                return this.editor.getContent()
            },
            getContentTxtMsj() {
                return this.editor.getContentTxt()
            },
            execCommand() {   //清空内容
                return this.editor.execCommand('cleardoc');
            },
            hasContent() {
                return this.editor.hasContent()
            }
        },
        destroyed() {
            this.$nextTick(() => {
                let dom = document.getElementById('editor')
                if (dom) {
                    dom.parentElement.removeChild(dom)
                }
            });
            return this.editor.destroy();
        }
    }
</script>