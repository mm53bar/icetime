window.Event = new Vue();

Vue.component('lineup', {
  template: `
    <div @dragover.prevent @drop.prevent='drop' class='lineup'>
      <div class='forwards'/>
      <div class='defense'/>
    </div>
  `,
  methods: {
    drop: e => {
      const player_id = e.dataTransfer.getData('player_id');
      const player = document.getElementById(player_id);
      e.target.appendChild(player);
    }
  }
});

Vue.component('roster', {
  template: `
    <div class="roster">
      <player id="player-1" number="5" draggable='true'>Sam</player>
      <player id="player-2" number="6" draggable='true'>Keaton</player>
      <player id="player-3" number="8" draggable='true'>Nik</player>
    </div>
  `
});

Vue.component('player', {
  template: `
  <a :id='id' :draggable='draggable' @dragstart='dragStart' @dragend='dragEnd' @dragover.stop @click='toggle' class='player button is-rounded is-large' :class="[activeClass]">
    <span class="player-number">{{ number }}</span>
    <span class="player-name"><slot></slot></span>
    <span class="player-time">{{minutes}}:{{seconds}}</span>
  </a>
  `,
  props: ['number', 'id', 'draggable'],
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
    },
    dragStart: e => {
      const target = e.target;
      e.dataTransfer.setData('player_id', target.id);
      setTimeout(() => {
        target.style.display = 'none';
      }, 0);
    },
    dragEnd: e => {
      const target = e.target;
      target.style.display = 'inherit';
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
    },
    activeClass: function() {
      if (this.isActive) {
        return 'is-success';
      } else {
        return 'is-danger';
      }
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

