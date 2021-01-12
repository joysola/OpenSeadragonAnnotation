import fabric from '@/assets/OpenseadragonFabricjsOverlay/fabric/fabric.adapted.js'
export default {
  name: 'Home',
  data() {
    return {
      //userInfo: this.$store.getters.user,
      url: 'http://localhost:5001/Annotation',
      viewer: {},
      overlay: {}
    }
  },
  computed: {},
  props: {
    msg: String
  },
  components: {},
  methods: {
    InitFabricOverlay() {
      fabric.Object.prototype.strokeUniform = true // 边框和放大无关，恒定大小
      // var isDown
      // Initialize overlay
      var options = {
        scale: 1000
      }
      var overlay = this.viewer.fabricjsOverlay(options)

      // 自由画刷设置
      overlay.fabricCanvas().freeDrawingBrush.color = 'red'
      overlay.fabricCanvas().freeDrawingBrush.width = 10
      // Add fabric rectangle
      // var rect = {}
    }
  },
  mounted() {
    let _this = this
    _this.viewer = this.OpenSeadragon({
      id: 'openSeadragon1',
      prefixUrl: '/openseadragon/images/', //'../../node_modules/openseadragon/build/openseadragon/images/', //'https://openseadragon.github.io/openseadragon/images/',
      showNavigator: true, // 显示导航栏缩略图
      navigatorPosition: 'TOP_RIGHT',
      tileSources: {
        height: 63488,
        width: 65792,
        tileSize: 256,
        tileOverlap: 1,
        //minLevel: 9,
        getTileUrl: function(level, x, y) {
          return `${_this.url}/GetPicture?level=${level}&xx=${x}&yy=${y}`
        }
      }
    })
    this.InitFabricOverlay()
  },
  created() {
    //this.search()
    //this.searchInfos()
  }
}
