<template>
  <div id="app">
    <top></top>
    <nav-bar></nav-bar>
    <router-view/>
  </div>
</template>

<script>
  import Top from "components/index/Top";
  import NavBar from "components/index/NavBar";

  export default {
    name: 'app',
    components:{
      Top,
      NavBar,
    }
  }
</script>

<style>
  @import "assets/css/base.css";
</style>
