<template>
    <div>
        <script id="editor2" type="text/plain"></script>
        <!-- <span>{{defaultMsg}}</span> -->
    </div>
</template>
<script>

    export default {
        name: 'UE',
        data() {
            return {
                editor2: null,
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
            this.editor2 = UE.getEditor('editor2', this.config);
            // this.editor.addListener("ready", function () {
            //     _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            // });
        },
        watch: {
            defaultMsg(nv) {
                if (nv) {
                    // debugger
                    // console.log(nv)
                    this.editor2 = UE.getEditor('editor2', this.config);
                    this.editor2.setContent(nv); // 放入内容。
                }
            }
        },
        methods: {
            getUEContentMsj() { // 获取内容方法
                return this.editor2.getContent()
            },
            execCommand() {   //清空内容
                return this.editor2.execCommand('cleardoc');
            },
            hasContent() {
                return this.editor2.hasContent()
            }
        },
        destroyed() {
            // this.$nextTick(() => {
            //     let dom = document.getElementById('editor2')
            //     if (dom) {
            //         dom.parentElement.removeChild(dom)
            //     }
            // });
            return this.editor2.destroy();
        }
    }
</script>