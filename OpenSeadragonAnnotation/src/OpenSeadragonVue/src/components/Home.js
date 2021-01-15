/* eslint-disable no-console */

// import fabric from '@/assets/OpenseadragonFabricjsOverlay/fabric/fabric.adapted.js'
// import OpenSeadragon from 'openseadragon'
// import OSD from 'openseadragon'
// import '@/assets/OpenseadragonFabricjsOverlay/openseadragon-fabricjs-overlay.js'
export default {
  name: 'Home',
  data() {
    return {
      //userInfo: this.$store.getters.user,
      url: 'http://localhost:5001/Annotation',
      viewer: {},
      overlay: {},
      canvas: {}
    }
  },
  computed: {},
  props: {
    msg: String
  },
  components: {},
  methods: {
    initFabricOverlay() {
      window.fabric.Object.prototype.strokeUniform = true // 边框和放大无关，恒定大小
      let _this = this
      // var isDown
      // Initialize overlay
      var options = {
        scale: 1000
      }
      this.overlay = this.viewer.fabricjsOverlay(options)
      this.canvas = this.overlay.fabricCanvas()
      // 自由画刷设置
      this.canvas.freeDrawingBrush.color = 'red'
      this.canvas.freeDrawingBrush.width = 10
      // Add fabric rectangle
      // var rect = {}
      var itxt = new window.fabric.IText('你好\n迪赛特', {
        left: 300,
        top: 400,
        width: 300,
        height: 75.03,
        fill: '#049c82',
        angle: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        fontSize: 20,
        fontWeight: '',
        fontFamily: 'helvetica',

        styles: {}
      })
      itxt.on('mousedown:before', e => {
        console.log(`itext:mousedownbeforre:${e}`)
      })
      itxt.on('mouseover', options => {
        console.log(`itext:mouseover:${options}`)
        //options.e.preventDefault()
        //options.e.stopPropagation()
        //_this.viewer.setMouseNavEnabled(false)
      })
      itxt.on('mouseout', options => {
        console.log(`itext:mouseout:${options}`)
        // options.e.preventDefault()
        // options.e.stopPropagation()
        //_this.viewer.setMouseNavEnabled(true)
      })
      this.canvas.add(itxt)
      // this.viewer.setMouseNavEnabled(false)
      // this.viewer.outerTracker.setTracking(false)
    },
    initViewEvents() {
      let _this = this
      this.viewer.addHandler('canvas-click', e => {
        console.log(`osd:canvas-click:${e}`)
      })
      this.viewer.addHandler('canvas-press', e => {
        // 放弃选中
        _this.canvas.discardActiveGroup()
        _this.canvas.discardActiveObject()
        _this.canvas.renderAll()
        console.log(`osd:canvas-press:${e}`)
      })
      this.viewer.addHandler('canvas-drag-end', e => {
        console.log(`osd:canvas-drag-end:${e}`)
      })
    },
    initCanvasEvent() {
      // this.$nextTick(() => {
      let _this = this
      this.canvas.on('mouse:down', e => {
        console.log(`fab:mouse:down${e}`)
      })
      this.canvas.on('mousedown:before', e => {
        console.log(`fab:mousedown:before${e}`)
      })
      this.canvas.on('mouse:move', options => {
        //console.log(`fab:mouse:move${e}`)
        if (options.target !== undefined && options.target !== null) {
          _this.viewer.setMouseNavEnabled(false)
        } else {
          _this.viewer.setMouseNavEnabled(true)
        }
      })
      this.canvas.on('mouse:over', options => {
        console.log(`fab:mouse:over${options},${options.target}`)
      })

      this.canvas.on('mouse:out', options => {
        console.log(`fab:mouse:out${options}`)

        // _this.viewer.setMouseNavEnabled(true)
      })
    },
    press_handler(event) {},
    drag_handler(event) {},
    dragEnd_handler(event) {}
  },
  mounted() {
    let _this = this
    // eslint-disable-next-line no-undef
    _this.viewer = window.OpenSeadragon({
      // _this.viewer = OSD({
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
      },
      gestureSettingsMouse: {
        scrollToZoom: true,
        clickToZoom: false,
        dblClickToZoom: false
      }
    })

    this.initFabricOverlay()
    this.initViewEvents()
    this.initCanvasEvent()
  },
  created() {
    //window.OpenSeadragon = OpenSeadragon.Viewer
    //this.search()
    //this.searchInfos()
  }
}
