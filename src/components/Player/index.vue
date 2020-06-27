<template>
  <div class="container">
    <div v-if="displayType === DISPLAY_TYPES.IS_LOSE" class="loser">
      <div>負けなう</div>
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
    }
  },
  computed: {
    displayType() {
      if (this.isLose) {
        return this.DISPLAY_TYPES.IS_LOSE;
      } else if (
        !this.isLose &&
        this.displayUser.positionNumber == this.turnPosition
      ) {
        return this.DISPLAY_TYPES.IS_TURN;
      } else {
        return this.DISPLAY_TYPES.NONE;
      }
    }
  }
};
</script>

<style scoped>
.loser {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.turn {
  border: 0.711vw solid #ff002e;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
</style>