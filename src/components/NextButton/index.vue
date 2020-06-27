<template>
  <button id="nextButton" v-on:click="onClickHandler">次の人へ</button>
</template>

<script>
export default {
  props: {
    onClickHandler: {
      type: Function,
      required: true
    }
  }
};
</script>

<style scoped>
#nextButton {
  font-weight: bold;
  font-size: 2.778vw;
  line-height: 3.264vw;
  color: #ffffff;
  width: 18.056vw;
  height: 5.556vw;
  background: #2f80ed;
  cursor: pointer;
}
</style>