const app = Vue.createApp({
    template:`<count-down :timerDuration="timerDuration" @notify-to-app-for-seconds="updateTimerDuration"> </count-down>`,
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
        updateTimerDuration(value){
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
            hr:"",
            hl:"",
            mr:"",
            ml:"",
            sr:"",
            sl:""
        }
    },
    emits:['notify-to-app-for-seconds'],
    methods:{
        startTimer(){
            const thisTimer = this;
            let intervalTimer = setInterval(function(){
                let seconds = parseInt(thisTimer.totalSeconds, 10);
                let hours   = Math.floor(seconds / 3600); // get hours
                let minutes = Math.floor((seconds - (hours * 3600)) / 60); // get minutes
                seconds = seconds - (hours * 3600) - (minutes * 60); //  get seconds
                thisTimer.hl=((hours<10)?0:hours).toString().substring(0,1);
                thisTimer.hr=(hours<10)?hours.toString():hours.toString().substring(1,2);
                thisTimer.ml=((minutes<10)?0:minutes).toString().substring(0,1);
                thisTimer.mr=(minutes<10)?minutes.toString():minutes.toString().substring(1,2);
                thisTimer.sl=((seconds<10)?0:seconds).toString().substring(0,1);
                thisTimer.sr=(seconds<10)?seconds.toString():seconds.toString().substring(1,2);
                if(thisTimer.totalSeconds === 0){
                    clearInterval(intervalTimer);
                    thisTimer.$emit('notify-to-app-for-seconds',0);
                }
                thisTimer.totalSeconds--;
            }, 1000);
        }
    }
});

let countdownTimer = app.mount("#count-down-timer-div");
