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
      :loserPositionIds="loserPositionIds"
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
  data: function() {
    return {
      turnStartTime: Date.now()
    };
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
    loserPositionIds() {
      if (this.gameState.loserPositionIds == null) {
        return [];
      } else {
        return this.gameState.loserPositionIds;
      }
    },
    myTurn() {
      return this.gameState.turnPositionNumber == this.me.positionNumber;
    }
  },
  methods: {
    nextPerson() {
      // かかった秒数を求める
      const spentTime = (Date.now() - this.turnStartTime) / 1000;
      this.gameState.times[this.me.positionNumber - 1] -= spentTime;

      // もし60秒オーバーしてたら終了
      if (this.$whim.state.times[this.me.positionNumber - 1] <= 0.0) {
        // 空配列で初期化したけど, firebaseの関係でundefinedになるので,一人目の敗北者だったら空配列作る
        let losers = this.$whim.state.loserPositionIds;
        if (losers == null) {
          losers = [];
        }
        losers.push(this.me.positionNumber);
        this.$whim.assignState({
          loserPositionIds: losers
        });
      }

      // 次の人へ
      this.$whim.assignState({
        ...this.gameState,
        turnPositionNumber:
          (this.gameState.turnPositionNumber % this.$whim.users.length) + 1
      });
    },
    gameStart() {
      if (this.gameState.loading && this.gameState.loading == true) {
        return;
      }
      this.$whim.resetState();

      this.$whim.assignState({
        ...this.$whim.state,
        isFirstGame: false,
        loading: true
      });

      const turnPosition =
        Math.floor(Math.random() * this.$whim.users.length) + 1;

      // TODO: ピコピコルーレット実装
      this.$whim.assignState({
        gaming: true,
        times: this.$whim.users.map(() => 60),
        turnPositionNumber: turnPosition,
        loserPositionIds: [], // 空配列で初期化してるけど, 実際はfirebaseの関係でundefinedになる
        loading: false
      });
    }
  },
  watch: {
    myTurn: function(newState) {
      if (newState == true) {
        this.turnStartTime = Date.now();
      }
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
