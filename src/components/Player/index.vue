<template>
  <div class="container">
    <div
      v-show="(displayType !== DISPLAY_TYPES.IS_LOSE) && (displayType !== DISPLAY_TYPES.IS_WIN)"
      :style="{height: myLife,
      zIndex: 1,
      background: 'black',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      }"
    >{{myLife}}</div>
    <div v-if="displayType === DISPLAY_TYPES.IS_LOSE" class="loser">負け</div>
    <div v-if="displayType === DISPLAY_TYPES.IS_WIN" class="winner">
      <div>優勝は{{displayUser.name}}</div>
    </div>
    <div v-else-if="displayType === DISPLAY_TYPES.IS_TURN" class="turn"></div>
  </div>
</template>

<script>
export default {
  name: "Player",
  data: function() {
    return {
      DISPLAY_TYPES: {
        IS_LOSE: "isLose",
        IS_TURN: "isTurn",
        IS_WIN: "isWin",
        NONE: "none"
      }
    };
  },
  props: {
    displayUser: {
      type: Object,
      required: true
    },
    loserPositionIds: {
      type: Array
    },
    turnPosition: {
      type: Number
    },
    finished: {
      type: Boolean
    },
    times: {
      type: Array
    }
  },
  computed: {
    displayType() {
      if (this.loserPositionIds.includes(this.displayUser.positionNumber)) {
        return this.DISPLAY_TYPES.IS_LOSE;
      } else if (
        this.finished &&
        !this.loserPositionIds.includes(this.displayUser.positionNumber)
      ) {
        return this.DISPLAY_TYPES.IS_WIN;
      } else if (this.displayUser.positionNumber == this.turnPosition) {
        return this.DISPLAY_TYPES.IS_TURN;
      } else {
        return this.DISPLAY_TYPES.NONE;
      }
    },
    myLife() {
      if (this.times == null) {
        return "0%";
      }
      const myLife = this.times[this.displayUser.positionNumber - 1];
      return `${(1 - myLife / 60) * 100}%`;
    },
    stypes() {
      return {
        "--life": this.myLife
      };
    }
  }
};
</script>

<style scoped>
.loser {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  font-style: normal;
  font-weight: bold;
  font-size: 14.067vw;
  line-height: 20vw;

  color: #ffffff;
}

.turn {
  border: 0.711vw solid #ff002e;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}
</style>