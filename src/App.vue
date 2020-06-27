<template>
  <div id="app">
    <div id="mainContainer">
      <Main :mode="mode" />
      <div id="buttonContainer">
        <NextButton :onClickHandler="nextPerson" />
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
    NextButton: () => import("@/components/NextButton/index")
  },
  computed: {
    users() {
      return this.$whim.usrs;
    },
    mode() {
      return "clockwise";
    }
  },
  methods: {
    nextPerson() {
      console.debug("next!!");
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
