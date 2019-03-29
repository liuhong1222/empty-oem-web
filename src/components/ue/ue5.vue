<template>
    <div>
        <script id="editor5" type="text/plain"></script>
        <!-- <span>{{defaultMsg}}</span> -->
    </div>
</template>
<script>

    export default {
        name: 'UE',
        data() {
            return {
                editor5: null,
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
            this.editor5 = UE.getEditor('editor5', this.config);
            this.editor5.addListener("ready", function () {
                _this.editor5.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            });
        },
        watch: {
            defaultMsg(nv) {
                if (nv) {
                    // debugger
                    console.log(nv)
                    this.editor5 = UE.getEditor('editor5', this.config);
                    this.editor5.setContent(nv); // 放入内容。
                }
            }
        },
        methods: {
            getUEContentMsj() { // 获取内容方法
                return this.editor5.getContent()
            },
            execCommand() {   //清空内容
                return this.editor5.execCommand('cleardoc');
            },
            hasContent() {
                return this.editor5.hasContent()
            }
        },
        destroyed() {
            return this.editor5.destroy();
        }
    }
</script>