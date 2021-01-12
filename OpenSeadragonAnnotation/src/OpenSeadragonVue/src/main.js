import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import OpenSeadragon from 'openseadragon'
// import fabric from './assets/OpenseadragonFabricjsOverlay/fabric/fabric.adapted.js'
// import './assets/OpenseadragonFabricjsOverlay/openseadragon-fabricjs-overlay.js'

Vue.use(ElementUI)
Vue.prototype.OpenSeadragon = OpenSeadragon
Vue.config.productionTip = true

new Vue({
  render: h => h(App)
}).$mount('#app')
