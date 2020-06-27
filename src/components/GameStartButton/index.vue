<template>
  <button id="startButton" v-on:click="onClickHandler">
    <span v-if="isFirstGame == true">スタート</span>
    <span v-else>もう一回遊ぶ</span>
  </button>
</template>

<script>
export default {
  props: {
    onClickHandler: {
      type: Function,
      required: true
    },
    isFirstGame: {
      type: Boolean
    }
  }
};
</script>

<style scoped>
#startButton {
  font-weight: bold;
  font-size: 2.778vw;
  line-height: 3.264vw;
  color: #ffffff;
  width: 18.056vw;
  height: 5.556vw;
  background: #2f9a25;
  cursor: pointer;
}
</style>