import Vue from "vue";
import App from "./App.vue";
import whimClientVue from "whim-client-vue";
import "whim-client-vue/dist/whim-client-vue.css";

Vue.use(whimClientVue);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
