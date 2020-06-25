<template>
  <div id="app">
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
    Player: () => import("@/components/Player/index")
  },
  computed: {
    users() {
      return this.$whim.usrs;
    }
  }
};
</script>

<style scoped>
.main {
  position: relative;
  z-index: 1;
}
</style>
