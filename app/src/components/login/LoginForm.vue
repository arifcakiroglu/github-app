<style scoped lang="scss">
  .btn{
    cursor: pointer;
    background-color: rgba(0,0,0,.2);
    border-radius: 3px;
    width: 270px;
    padding: 12px 10px;
    font-size: 14px;
    font-weight: 300;
    color:#fff;
    border:0;
    &:hover{
      background-color: rgba(0,0,0,.2);
    }
    &:focus{
      outline: 0;
      background-color: rgba(0,0,0,.4);
    }
  }
</style>

<template>
    <div>
      <button class="btn" v-on:click="getAccess()">Connect with Github</button>
    </div>
</template>

<script>
  import base64 from 'base-64';
  import MarkdownIt from 'markdown-it';
  const {ipcRenderer} = require('electron');

  ipcRenderer.on('dashboard', (event, arg) => {
    window.location.href = "#/dashboard"
  })

  ipcRenderer.on('storage', (event, arg) => {
    window.localStorage.setItem('githubtoken', arg);
  });

  ipcRenderer.on('bearer', (event, arg) => {
    window.localStorage.setItem('bearer', arg);
  });

  export default {
    methods: {
      getAccess(){
        ipcRenderer.send('getAccess')
      }
    }
  }

</script>
