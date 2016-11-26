<style scoped>
  img {
    width: 156px;
    margin: 100px 0 15px;
  }
</style>

<template>
  <div>
    <div class="top-titlebar"></div>
    <img class="logo" src="./login/assets/logo.png" alt="Github App">
    <login-form></login-form>
  </div>
</template>

<script>
  import LoginForm from './login/LoginForm'

  export default {
    components: {
      LoginForm
    },
    name: 'login'
  }

</script>
