<template>
  <div id="app">
    <div id="mainContainer">
      <Main :mode="mode" :isCW="gameState.clockWise == true" :winner="winner" />
      <div
        id="buttonContainer"
        v-show="gameState.loading == null || gameState.loading == false && blink ==false"
      >
        <NextButton v-if="gameState.gaming == true && myTurn" :onClickHandler="nextPerson" />
        <GameStartButton
          v-else-if="gameState.gaming != true"
          :onClickHandler="gameStart"
          :isFirstGame="gameState.isFirstGame == true || gameState.isFirstGame == null"
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
      :times="gameState.times"
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
      interval: null,
      rouletteInterval: null
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
        return this.gameState.mode;
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
    },
    loading() {
      return this.gameState.loading;
    },
    gaming() {
      return this.gameState.gaming;
    },
    blink() {
      return this.gameState.blink;
    },
    winner() {
      if (this.finished == true) {
        let winnerUser = -1;
        this.users.forEach(u => {
          if (!this.loserPositionIds.includes(u.positionNumber)) {
            winnerUser = u;
          }
        });

        return winnerUser;
      } else {
        return -1;
      }
    }
  },
  methods: {
    nextPerson() {
      if (this.checkTimeLimit()) {
        this.iamLose();
      }

      // 1人を除いて皆負けたら終わり
      if (
        this.gameState.loserPositionIds &&
        this.users.length - 1 <= this.gameState.loserPositionIds.length
      ) {
        this.finishGame();
        return;
      }

      // 次のモードをランダムに決定
      const nextMode = this.selectNextMode();
      this.$whim.assignState({ mode: nextMode });

      // 次の人へ
      this.goToNext(nextMode);
    },
    gameStart() {
      if (this.gameState.loading && this.gameState.loading == true) {
        return;
      }

      // みんなにルーレットの司令
      this.$whim.assignState({
        ...this.$whim.state,
        isFirstGame: false,
        loading: true
      });

      // 最初の人を決める
      const turnPosition =
        Math.floor(Math.random() * this.$whim.users.length) + 1;
      // 最初の人を皆に通知
      this.$whim.assignState({
        times: this.$whim.users.map(() => 60),
        turnPositionNumber: turnPosition,
        loserPositionIds: [], // 空配列で初期化してるけど, 実際はfirebaseの関係でundefinedになる
        mode: "clockwise",
        clockWise: true
      });

      // ルーレット止める指令
      setTimeout(() => {
        this.$whim.assignState({
          gaming: true,
          blink: true,
          loading: false
        });
      }, 3000);
    },
    checkTimeLimit() {
      // もし持ち時間がなくなってたらtrueを返す
      if (this.gameState.times[this.me.positionNumber - 1] <= 0.0) {
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
    goToNext(nextMode) {
      // 時計回り, 反時計周り情報だけ更新する
      if (nextMode == "clockwise") {
        this.$whim.assignState({ clockWise: true });
      } else if (nextMode == "counter-clockwise") {
        this.$whim.assignState({ clockWise: false });
      }

      // もう一度なら回答開始時間を更新してもう一回
      if (nextMode == "onemore") {
        return;
      }

      if (this.gameState.clockWise != true) {
        // 反時計回りに次の人へ
        let nextPosition =
          (this.gameState.turnPositionNumber - 1) % this.users.length;
        if (nextPosition === 0) {
          nextPosition = this.users.length;
        }

        this.$whim.assignState({
          ...this.gameState,
          turnPositionNumber: nextPosition
        });
      } else {
        // 時計回りに次の人へ
        this.$whim.assignState({
          ...this.gameState,
          turnPositionNumber:
            (this.gameState.turnPositionNumber % this.$whim.users.length) + 1
        });
      }

      // 次の人が馬上状態だったらもう一回
      if (this.loserPositionIds.includes(this.gameState.turnPositionNumber)) {
        this.goToNext(nextMode);
      }
    },
    finishGame() {
      this.$whim.assignState({
        gaming: false
      });
    },
    selectNextMode() {
      // 次のモードをランダムに決定する
      const modes = {
        SONOMAMA: 0.4,
        HANTEN: 0.5,
        BONUS: 0.55,
        ONE_MORE: 0.6,
        MORE_5CHAR: 0.75,
        ONLY_COUNTRY: 0.9,
        GOOD_VOICE: 1.0
      };
      const rand = Math.random();

      if (rand <= modes.SONOMAMA) {
        if (this.mode == "cloclwise") {
          return "clockwise";
        } else {
          return "counter-clockwise";
        }
      } else if (rand <= modes.HANTEN) {
        if (this.mode == "cloclwise") {
          return "counter-clockwise";
        } else {
          return "clockwise";
        }
      } else if (rand <= modes.BONUS) {
        return "bonus";
      } else if (rand <= modes.ONE_MORE) {
        if (
          this.gameState.loserPositionIds &&
          this.gameState.loserPositionIds.includes(this.me.positionNumber)
        ) {
          if (this.mode == "cloclwise") {
            return "clockwise";
          } else {
            return "counter-clockwise";
          }
        }
        return "onemore";
      } else if (rand <= modes.MORE_5CHAR) {
        return "more-5chars";
      } else if (rand <= modes.ONLY_COUNTRY) {
        return "only-country";
      } else {
        return "good-voice";
      }
    }
  },
  watch: {
    myTurn: function(newState, oldState) {
      if (this.gameState.gaming == false) {
        clearInterval(this.interval);
        return;
      }

      // 自分のターンが回ってきたときに行う処理
      if (newState == true) {
        // modeがBONUSなら10秒持ち時間に追加する
        if (this.mode == "bonus") {
          this.gameState.times[this.me.positionNumber - 1] += 10;
          this.$whim.assignState({ ...this.gameState });
        }

        // 毎秒オーバーしてないか確認する処理を追加
        this.interval = setInterval(() => {
          // 残り時間から1秒へらす
          this.gameState.times[this.me.positionNumber - 1] -= 1.0;
          this.$whim.assignState({
            times: this.gameState.times
          });

          if (this.checkTimeLimit()) {
            this.iamLose();
            clearInterval(this.interval);
            this.nextPerson();
          }
        }, 1000);
      } else if (oldState == true && newState == false) {
        clearInterval(this.interval);
      }
    },
    loading: function(newLoading) {
      // loadingがtrueになったらルーレット回す. falseになったらルーレット止める
      if (newLoading == true) {
        // ルーレット
        this.rouletteInterval = setInterval(() => {
          if (this.gameState.turnPositionNumber == null) {
            this.gameState.turnPositionNumber = 1;
            this.$whim.assignState({
              ...this.gameState
            });
          } else {
            this.gameState.turnPositionNumber =
              (this.gameState.turnPositionNumber % this.users.length) + 1;
          }
        }, 300);
      } else if (newLoading == false) {
        clearInterval(this.rouletteInterval);
      }
    },
    gaming(newGaming, oldGaming) {
      // loadingがfalseになって, gamingがtrueになったら点滅させる
      if (
        oldGaming == false &&
        newGaming == true &&
        this.gameState.loading == false &&
        this.blink == true
      ) {
        let truePosition = this.gameState.turnPositionNumber;
        const interval = setInterval(() => {
          if (this.gameState.turnPositionNumber == -1) {
            this.gameState.turnPositionNumber = truePosition;
          } else {
            this.gameState.turnPositionNumber = -1;
          }
        }, 500);

        setTimeout(() => {
          this.$whim.assignState({
            turnPositionNumber: truePosition,
            gaming: true,
            blink: false,
            loding: false
          });
          clearInterval(interval);
        }, 3000);
      }
    }
  },
  destroyed() {
    this.$whim.resetState();
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
  z-index: 5;
}

#buttonContainer {
  margin: 24px auto 0;
  z-index: 5;
}
</style>
