var appNodeId = "app"

var vueAppOptions = {
    template: `
<el-button @click='countUp'>INC</el-button>
{{counter}}
<el-button @click='countDown'>DEC</el-button>
`,
    data() { return {
        logger: new Logger("vue-test-app"),
    }},
    methods: {
        countUp() {
            this.$store.commit("countUp")
        },
        countDown() {
            this.$store.commit("countDown")
        },
    },
    computed: {
        counter() {
            return this.$store.state.counter
        }
    },
    mounted() {
        this.logger.info("VueApp已挂载")
    }
}

var storeOptions = {
    state() { return {
        counter: 0
    }},
    mutations: {
        countUp(state) {
            state.counter++
        },
        countDown(state) {
            if (state.counter > 0) {
                state.counter--
            }
        }
    }
}

var injectStyles = `
`
