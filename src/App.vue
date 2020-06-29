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
      v-for="user in users"
      :key="user.id"
      :class="whimUserWindowClass(user)"
      :displayUser="user"
      :loserPositionIds="loserPositionIds"
      :turnPosition="gameState.turnPositionNumber"
      :finished="finished"
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
      turnStartTime: Date.now(),
      interavl: null
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
      return this.$whim.users;
    },
    me() {
      return this.$whim.accessUser;
    },
    mode() {
      if (this.gameState.mode == null) {
        return "initial";
      } else {
        return "cloclwise";
      }
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
    },
    finished() {
      if (
        this.gameState.isFirstGame == false &&
        this.gameState.gaming == false &&
        this.gameState.loserPositionIds &&
        this.users.length - 1 <= this.gameState.loserPositionIds.length
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    nextPerson() {
      if (this.checkTimeLimit()) {
        this.iamLose();
      }

      // 次の人へ
      this.goToNext();
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
        loading: false,
        mode: "clockwise"
      });
    },
    checkTimeLimit() {
      // かかった秒数を求めてローカルステートを更新する
      const spentTime = (Date.now() - this.turnStartTime) / 1000;
      this.gameState.times[this.me.positionNumber - 1] -= spentTime;

      // もし持ち時間がなくなってたらtrueを返す
      if (this.$whim.state.times[this.me.positionNumber - 1] <= 0.0) {
        return true;
      } else {
        return false;
      }
    },
    iamLose() {
      // 自分を負け状態にする
      // 空配列で初期化したけど, firebaseの関係でundefinedになるので,一人目の敗北者だったら空配列作る
      let losers = this.$whim.state.loserPositionIds;
      if (losers == null) {
        losers = [];
      }
      losers.push(this.me.positionNumber);
      this.$whim.assignState({
        loserPositionIds: losers
      });
    },
    goToNext() {
      if (
        this.gameState.loserPositionIds &&
        this.users.length - 1 <= this.gameState.loserPositionIds.length
      ) {
        this.finishGame();
        return;
      }
      // 次の人へ
      this.$whim.assignState({
        ...this.gameState,
        turnPositionNumber:
          (this.gameState.turnPositionNumber % this.$whim.users.length) + 1
      });
    },
    finishGame() {
      this.$whim.assignState({
        gaming: false
      });
    }
  },
  watch: {
    myTurn: function(newState, oldState) {
      if (this.gameState.gaming == false) {
        clearInterval(this.interavl);
        return;
      }

      // 毎秒オーバーしてないか確認する.
      if (newState == true) {
        this.turnStartTime = Date.now();
        this.interavl = setInterval(() => {
          if (this.checkTimeLimit()) {
            this.iamLose();
            clearInterval(this.interavl);
            this.goToNext();
          }
        }, 1000);
      } else if (oldState == true && newState == false) {
        clearInterval(this.interavl);
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
