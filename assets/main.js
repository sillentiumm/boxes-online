
const socket = io()
const App = {
    data() {
        socket.on('message', (data) => {
            this.turn(data.index)
        })
        socket.on('reset', (data) => {
            this.reset()
        })
        socket.on('waiting', (data) => {
            this.waiting = 0
        })
        socket.on('waiting2', (data) => {
            this.waiting = 1
        })
        return {
            list: [],
            player: 1,
            arrHorizontal: [],
            arrVertical: [],
            arrdiagonal1: [],
            arrdiagonal2: [],
            countPlus: 0,
            countMinus: 0,
            k: 0,
            rules: 0,
            winner: 0,
            waiting: 1
        }
    },
    methods: {
        rulesOn() {
            this.rules = 1
        },
        rulesOff() {
            this.rules = 0
        },
        start() {
            for(i= 0; i < 100; i++) {
                this.list.push(0)
            }
        },
        resetBtn() {
            socket.emit("reset")
        },
        reset() {
            //socket.emit("reset")
            this.list=[]
            this.player = 1
            this.start()
            this.countPlus = 0
            this.countMinus = 0
            this.winner = 0
        },
        turn(idx) {
            if(this.player == 1) {
                if(this.list[idx] !== 0 || this.list[idx + 10] == 0 ) {
                    return false
                }
                else {
                    this.list[idx] = 1
                    this.player = -1
                }
            }
            else {
                if(this.list[idx] !== 0 || this.list[idx + 10] == 0 ) {
                    return false
                }
                else {
                    this.list[idx] = -1
                    this.player = 1
                }
            }
            this.testHorizontal(idx)
            this.testVertical(idx)
            this.testDiagonal1(idx)
            this.testDiagonal2(idx)
        },

        testHorizontal(idx) {
            this.arrHorizontal = []
            for(i = 0; i < 10; i++) {
                this.arrHorizontal.push(this.list[Math.floor(idx / 10) * 10 + i])
            }
            this.test2(this.arrHorizontal)
        },

        testVertical(idx) {
            this.arrVertical = []
            for(i = 0; i < 10; i++) {
                this.arrVertical.push(this.list[idx % 10 + i * 10])
            }
            this.test2(this.arrVertical)
        },

        testDiagonal1(idx) {
            this.arrdiagonal1 = []
                while(((idx - 11 * this.k) % 10 !== 0) && idx - 11 * this.k >= 0 ) {
                    this.arrdiagonal1.unshift(this.list[idx -11 * this.k])
                    this.k++
                }
                this.arrdiagonal1.unshift(this.list[idx -11 * this.k])
                this.k = 1
                while(((idx + 11 * this.k) % 10 !== 0) && idx + 11 * this.k < 100 ) {
                    this.arrdiagonal1.push(this.list[idx + 11 * this.k])
                    this.k++
                }
                this.k = 0
                this.test2(this.arrdiagonal1)
        },

        testDiagonal2(idx) {
            this.arrdiagonal2 = []
                while(((idx - 9 * this.k) % 10 !== 9) && idx - 9 * this.k >= 0 ) {
                    this.arrdiagonal2.unshift(this.list[idx - 9 * this.k])
                    this.k++
                }
                if (idx - 9 * this.k >= 0) {
                    this.arrdiagonal2.unshift(this.list[idx - 9 * this.k])
                }
                this.k = 1
                while(((idx + 9 * this.k) % 10 !== 9) && idx + 9 * this.k < 100 ) {
                    this.arrdiagonal2.push(this.list[idx + 9 * this.k])
                    this.k++
                }
                this.k = 0
                this.test2(this.arrdiagonal2)

        },

        test2(arr) {
            for(j = 0; j < arr.length; j++) {
                if(arr[j] == 1) {
                    if(this.countPlus == 3) {
                        if(this.winner == 0) {
                            this.winner = 1
                        }
                    }
                    else {
                        this.countMinus = 0
                        this.countPlus++
                    }              
                }
                else if(arr[j] == - 1) {
                    if(this.countMinus == 3) {
                        if(this.winner == 0) {
                            this.winner = -1
                        }   
                    }
                    else {                
                        this.countPlus = 0
                        this.countMinus++
                    }
                }
                else {
                    this.countPlus = 0
                    this.countMinus = 0
                }
            }
            this.countPlus = 0
            this.countMinus = 0
        },
        met(idx) {
            socket.emit('index', {
                index: idx
            })
        },
    },
    beforeMount(){
        this.start()
    }, 
}
Vue.createApp(App).mount(".main")

