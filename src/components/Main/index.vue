<template>
  <div id="main">
    <div id="cycle" v-if="mode == 'initial'">しりとりの「り」から！</div>
    <div v-else-if="mode != 'initial' && winner != -1">優勝は{{winner.name}}!</div>
    <div id="cycle" v-else-if="mode != 'initial' && isCW === true">
      <img id="right" src="@/assets/triangle.png" />
      <div id="wrapper">
        <img id="up" src="@/assets/triangle.png" />
        <Mode :mode="mode" />
        <img id="down" src="@/assets/triangle.png" />
      </div>
      <img id="left" src="@/assets/triangle.png" />
    </div>
    <div id="cycle" v-else-if="mode != 'initial' && isCW === false">
      <img id="left" src="@/assets/triangle.png" />
      <div id="wrapper">
        <img id="down" src="@/assets/triangle.png" />
        <Mode :mode="mode" />
        <img id="up" src="@/assets/triangle.png" />
      </div>
      <img id="right" src="@/assets/triangle.png" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  components: {
    Mode: () => import("./mode")
  },
  props: {
    mode: {
      type: String,
      required: true
    },
    isCW: {
      type: Boolean,
      required: true
    },
    winner: {}
  }
};
</script>

<style scoped>
#main {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  width: 20.056vw;
  padding: 1vw;
  height: 12.014vw;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.833vw;
  font-size: 2.4vw;
  font-weight: bold;
  text-align: center;
  color: #ff002e;
  z-index: 5;
}

#cycle {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

img {
  width: 1.389vw;
  height: 2.361vw;
}

#wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

#right {
  transform: rotate(90deg);
}

#left {
  transform: rotate(-90deg);
}

#up {
}

#down {
  transform: rotate(-180deg);
}
</style>