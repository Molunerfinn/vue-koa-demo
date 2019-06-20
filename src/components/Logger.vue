<template>
  <div id="loggerContainer" class="loggerContainer" v-if="isDebug">
    <button @click="openLogger"> open </button>
    <button @click="closeLogger"> close </button>
    <div class="messagesWrap" v-show="isOpen">
      <ul>
        <li v-for="o in messages">{{o}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    isDebug: {
      default: false
    }

  },
  data () {
    return {
      messages: [],
      isOpen: false,
    }
  },
  methods: {
    log(msg){
      this.messages.push(msg)
    },
    openLogger(){
      this.isOpen = true
    },
    closeLogger(){
      this.isOpen = false
    }

  }
}
</script>

<style lang="css" scoped>
.loggerContainer{

  position: fixed;
  top: 10px;
  bottom: 10px;
  width: 90%;
  overflow: auto;
}
.messagesWrap{
  background-color: gray;
  color: white;
}
</style>
