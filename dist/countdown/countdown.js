const app = Vue.createApp({
    template:`<count-down :timerDuration="timerDuration" @update-seconds-to-app="setTimerDuration"> </count-down>`,
    data() {
        return{
            timerDuration:0
        }
    },
    watch:{
        timerDuration() {
            if(this.timerDuration === 0){
                onCountDownTimerComplete();
            }
        }
    },
    methods:{
        setTimerDuration(value){
            this.timerDuration=value;
        }
    }
});

app.component('count-down',{
    template:`
        <div>
            <span class="h-l">{{hl}}</span>
            <span class="h-r">{{hr}}</span>
        </div>
        <div>
            <span class="devider">:</span>
        </div>
        <div>
            <span class="m-l">{{ml}}</span>
            <span class="m-r">{{mr}}</span>
        </div><div>
            <span class="devider">:</span>
        </div>
        <div>
            <span class="s-l">{{sl}}</span>
            <span class="s-r">{{sr}}</span>
        </div>
    `,
    props:{
        timerDuration:Number
    },
    watch:{
        timerDuration() {
            if(this.timerDuration>0){
                this.totalSeconds = this.timerDuration;
                this.startTimer();
            }
        }
    },
    data() {
        return {
            totalSeconds:0,
            seconds:0,
            hours:0,
            minutes:0
        }
    },
    emits:['update-seconds-to-app'],
    computed:{
        hl(){ return this.calculateLeftValue(this.hours) },
        hr(){ return this.calculateRightValue(this.hours) },
        ml(){ return this.calculateLeftValue(this.minutes) },
        mr(){ return this.calculateRightValue(this.minutes) },
        sl(){ return this.calculateLeftValue(this.seconds) },
        sr(){ return this.calculateRightValue(this.seconds) },
    },
    methods:{
        calculateLeftValue(value){
            return ((value<10)?0:value).toString().substring(0,1);
        },
        calculateRightValue(value){
            return (value<10)?value.toString():value.toString().substring(1,2);
        },
        startTimer(){
            const thisTimer = this;
            let intervalTimer = setInterval(function(){
                thisTimer.hours   = Math.floor(thisTimer.totalSeconds / 3600); // get hours
                thisTimer.minutes = Math.floor((thisTimer.totalSeconds - (thisTimer.hours * 3600)) / 60); // get minutes
                thisTimer.seconds = thisTimer.totalSeconds - (thisTimer.hours * 3600) - (thisTimer.minutes * 60); //  get seconds
                if(thisTimer.totalSeconds === 0){
                    clearInterval(intervalTimer);
                    thisTimer.$emit('update-seconds-to-app',0);
                }
                thisTimer.totalSeconds--;
            }, 1000);
        }
    }
});

let countdownTimer = app.mount("#count-down-timer-div");
