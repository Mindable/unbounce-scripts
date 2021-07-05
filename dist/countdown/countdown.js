const app = Vue.createApp({
    template:`<count-down ref="myTimer"> </count-down>`,
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
    data() {
        return {
            hr:"",
            hl:"",
            mr:"",
            ml:"",
            sr:"",
            sl:""
        }
    },
    methods:{
        startTimer(totalSeconds){
            const thisTimer = this;
            let intervalTimer = setInterval(function(){
                let seconds = parseInt(totalSeconds, 10);
                let hours   = Math.floor(seconds / 3600); // get hours
                let minutes = Math.floor((seconds - (hours * 3600)) / 60); // get minutes
                seconds = seconds - (hours * 3600) - (minutes * 60); //  get seconds
                thisTimer.hl=((hours<10)?0:hours).toString().substring(0,1);
                thisTimer.hr=(hours<10)?hours.toString():hours.toString().substring(1,2);
                thisTimer.ml=((minutes<10)?0:minutes).toString().substring(0,1);
                thisTimer.mr=(minutes<10)?minutes.toString():minutes.toString().substring(1,2);
                thisTimer.sl=((seconds<10)?0:seconds).toString().substring(0,1);
                thisTimer.sr=(seconds<10)?seconds.toString():seconds.toString().substring(1,2);
                if(totalSeconds === 0){
                    clearInterval(intervalTimer);
                    onCountDownTimerComplete();
                    return true;
                }
                totalSeconds--;
            }, 1000);
        }
    }
});

let countdownTimer = app.mount("#count-down-timer-div");
