<template>
  <div id="app">
    <div id="mainContainer">
      <Main :mode="mode" />
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
    Main: () => import("@/components/Main/index")
  },
  computed: {
    users() {
      return this.$whim.usrs;
    },
    mode() {
      return "clockwise";
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
}
</style>
