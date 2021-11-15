<template>
    <div>
        <script id="editor1" type="text/plain"></script>
        <!-- <span>{{defaultMsg}}</span> -->
    </div>
</template>
<script>

    export default {
        name: 'UE',
        data() {
            return {
                editor1: null,
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
            this.editor1 = UE.getEditor('editor1', this.config);
            // this.editor.addListener("ready", function () {
            //     _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            // });
        },
        watch: {
            defaultMsg(nv) {
                if (nv) {
                    // debugger
                    // console.log(nv)
                    this.editor1 = UE.getEditor('editor1', this.config);
                    this.editor1.setContent(nv); // 放入内容。
                }
            }
        },
        methods: {
            execCommand() {   //清空内容
                return this.editor1.execCommand('cleardoc');
            },
            hasContent() {
                return this.editor1.hasContent()
            }
        },
        destroyed() {
            this.$nextTick(() => {
                let dom = document.getElementById('editor1')
                if (dom) {
                    dom.parentElement.removeChild(dom)
                }
            });
            return this.editor1.destroy();
        }
    }
</script>