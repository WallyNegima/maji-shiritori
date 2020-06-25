import Vue from "vue";
import App from "./App.vue";
import whimClientVue from "whim-client-vue";
Vue.use(whimClientVue);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
