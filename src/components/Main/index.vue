<template>
  <div id="main">
    <div v-if="mode == 'clockwise'">時計回り</div>
    <div v-else-if="mode == 'counter-clockwise'">逆時計回り</div>
    <div v-else-if="mode == 'bounus'">10秒ボーナス</div>
    <div v-else-if="mode == 'onemore'">もう一度</div>
    <div v-else-if="mode == 'more-5chars'">5文字以上</div>
    <div v-else-if="mode == 'only-country'">国名縛り</div>
    <div v-else-if="mode == 'good-voice'">野太い声で</div>
  </div>
</template>

<script>
export default {
  name: "Main",
  props: {
    mode: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
#main {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  width: 18.056vw;
  height: 12.014vw;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.833vw;
}
</style>