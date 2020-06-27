<template>
  <div id="app">
    <div id="mainContainer">
      <Main :mode="mode" />
      <div id="buttonContainer">
        <NextButton v-if="gaming == true" :onClickHandler="nextPerson" />
        <GameStartButton v-else :onClickHandler="gameStart" :isFirstGame="isFirstGame" />
      </div>
    </div>
    <Player
      v-for="user in $whim.users"
      :key="user.id"
      :class="whimUserWindowClass(user)"
      :displayUser="user"
      :isLose="true"
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
      isFirstGame: true,
      gaming: false
    };
  },
  computed: {
    users() {
      return this.$whim.usrs;
    },
    mode() {
      return "clockwise";
    }
    // isFirstGame() {
    //   return true;
    // }
  },
  methods: {
    nextPerson() {
      console.debug("next!!");
    },
    gameStart() {
      console.debug("start game");
      this.isFirstGame = false;
      this.gaming = true;
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
