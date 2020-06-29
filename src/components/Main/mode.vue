<template>
  <div>
    <span v-if="mode == 'clockwise'">時計回り</span>
    <span v-else-if="mode == 'counter-clockwise'">逆時計回り</span>
    <span v-else-if="mode == 'bonus'">10秒ボーナス</span>
    <span v-else-if="mode == 'onemore'">もう一度</span>
    <span v-else-if="mode == 'more-5chars'">5文字以上</span>
    <span v-else-if="mode == 'only-country'">国名縛り</span>
    <span v-else-if="mode == 'good-voice'">野太い声で</span>
  </div>
</template>
<script>
export default {
  props: {
    mode: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
div {
  min-width: 15vw;
}
</style>