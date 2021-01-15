import Vue from 'vue'
import App from './App.vue'
// import OSD from 'openseadragon'
import './assets/OSDAssistance'
import ElementUI from 'element-ui'
import '@/assets/OpenseadragonFabricjsOverlay/openseadragon-fabricjs-overlay'
// import '@/assets/FabAssistance'
import Fabric from 'fabric'
Vue.use(Fabric)
// Vue.prototype.Fabric = Fabric
Vue.use(ElementUI)
// window.OpenSeadragon = OSD.OpenSeadragon.Viewer
Vue.config.productionTip = true

new Vue({
  render: h => h(App)
}).$mount('#app')
