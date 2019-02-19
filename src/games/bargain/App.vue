<style>

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

</style>

<template>

<div id="app">
    this is bargain game. {{ msg }}
</div>

</template>

<script>

export default {
    name: 'app',
    data() {
      return {
        msg: 'this is world'        
      }
    }
}

</script>
