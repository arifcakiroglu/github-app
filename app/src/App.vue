<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300,700);

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  a{
    text-decoration: none;
  }

  html,
  body { height: 100%; }

  body {
    background:
      radial-gradient(
        ellipse at top right,
        #775496 0%,
        #552758 100%
      );
    background-position: center;
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    text-align: center;
  }
  .top-titlebar {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 32px;
    background-color: rgba(0,0,0, .2);
    -webkit-user-select: none;
    -webkit-app-region: drag;
  }
</style>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>
