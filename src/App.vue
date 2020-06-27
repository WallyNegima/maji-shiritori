<template>
  <div id="app">
    <div id="mainContainer">
      <Main :mode="mode" />
      <div id="buttonContainer">
        <NextButton v-if="gameState.gaming == true && myTurn" :onClickHandler="nextPerson" />
        <GameStartButton
          v-else-if="gameState.gaming != true"
          :onClickHandler="gameStart"
          :isFirstGame="gameState.isFirstGame == true"
        />
      </div>
    </div>
    <Player
      v-for="user in $whim.users"
      :key="user.id"
      :class="whimUserWindowClass(user)"
      :displayUser="user"
      :loserPositionIds="[]"
      :turnPosition="gameState.turnPositionNumber"
    />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
    Player: () => import("@/components/Player/index"),
    Main: () => import("@/components/Main/index"),
    NextButton: () => import("@/components/NextButton/index"),
    GameStartButton: () => import("@/components/GameStartButton/index")
  },
  mounted: function() {
    if (this.$whim.state.inited == null) {
      this.$whim.assignState({
        inited: true,
        isFirstGame: true,
        gaming: false
      });
    }
  },
  computed: {
    users() {
      return this.$whim.usrs;
    },
    me() {
      return this.$whim.accessUser;
    },
    mode() {
      return "clockwise";
    },
    gameState() {
      return this.$whim.state;
    },
    myTurn() {
      return this.gameState.turnPositionNumber == this.me.positionNumber;
    }
  },
  methods: {
    nextPerson() {
      this.$whim.assignState({
        turnPositionNumber:
          (this.gameState.turnPositionNumber % this.$whim.users.length) + 1
      });
    },
    gameStart() {
      if (this.gameState.loading && this.gameState.loading == true) {
        return;
      }

      this.$whim.assignState({
        ...this.$whim.state,
        isFirstGame: false,
        loading: true
      });

      const turnPosition =
        Math.floor(Math.random() * this.$whim.users.length) + 1;

      // TODO: ピコピコルーレット実装
      this.$whim.assignState({
        ...this.$whim.state,
        gaming: true,
        turnPositionNumber: turnPosition,
        loading: false
      });
    }
  }
};
</script>

<style scoped>
#mainContainer {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1;
}

#buttonContainer {
  margin: 24px auto 0;
  z-index: 1;
}
</style>
