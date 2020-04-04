window.Event = new Vue();

Vue.component('player', {
  template: `
  <a @click='toggle' class='player button is-rounded is-large' :class="[isActive ? 'is-success' : 'is-danger']">
    <span class="player-number">{{ number }}</span>
    <span class="player-name"><slot></slot></span>
    <span class="player-time">{{minutes}}:{{seconds}}</span>
  </a>
  `,
  props: ['number'],
  data() {
    return {
      isActive: false,
      time: 0
    }
  },
  created() {
    Event.$on('on-tick', () => this.increment());
  },
  methods: {
    toggle(){
      this.isActive = !this.isActive; 
    },
    increment(){
      if(this.isActive) this.time += 1;
    },
    padTime(num){
      return (num < 10 ? '0' : '') + num.toString();
    }
  },
  computed: {
    minutes: function() {
      const minutes = Math.floor(this.time / 60);
      return this.padTime(minutes);
    },
    seconds: function() {
      const seconds = this.time % 60;
      return this.padTime(seconds);
    }
  }
})

Vue.component('clock', {
  template: `
  <div id="timer">
    <button class="button is-large is-success" @click="playPause()"> 
      <i class="far" v-bind:class="{'fa-pause-circle': getPlayState(), 'fa-play-circle': !getPlayState()}"></i>
    </button>
    <span class="monospace">{{minutes}}:{{seconds}}</span>
    <button id="reset is-small" class="button" @click="reset()"> 
      <i class="fas fa-undo"></i>
    </button>
  </div>
  `,
  data() {
    return {
      defaultTime: 60 * 20,
      time: 0,
      timer: null
    };
  },
  created(){
    this.time = this.defaultTime;
  },
  methods: {
    padTime(num){
      return (num < 10 ? '0' : '') + num.toString();
    },
    playPause(){
      if(!this.timer){
        this.play();
      }else{
        this.pause();
      }
    },
    play(){
      if(this.time <= 0) this.time = this.defaultTime;
      this.timer = setInterval(() => {
        this.time -= 1;
        Event.$emit('on-tick', this.time);
        if(this.time <= 0) this.playPause();
      }, 1000);
    },
    pause(){
      clearInterval(this.timer);
      this.timer = null;
    },
    reset(){
      this.time = this.defaultTime;
    },
    getPlayState(){
      return !!this.timer;
    }
  },
  computed: {
    minutes: function() {
      const minutes = Math.floor(this.time / 60);
      return this.padTime(minutes);
    },
    seconds: function() {
      const seconds = this.time % 60;
      return this.padTime(seconds);
    }
  }
});

const app = new Vue({
  el: '#app',
});

