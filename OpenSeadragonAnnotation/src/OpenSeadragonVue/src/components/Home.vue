<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <p>
      Welcome to your new single-page application, built with
      <a
        href="https://vuejs.org"
        target="_blank"
      >Vue.js</a>.
    </p>
    <!-- <div>
      <img src="../assets/openseadragon/images/button_grouphover.png" />
    </div>-->
    <div id="openSeadragon1" style="width:95%; height:970px;"></div>
  </div>
</template>


 <!-- <script src="@/assets/OpenseadragonFabricjsOverlay/fabric/fabric.adapted.js"></script>-->
 <!-- <script src="@/assets/OpenseadragonFabricjsOverlay/openseadragon-fabricjs-overlay.js"></script>-->
<script>
import Home from './Home.js'
export default Home
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

