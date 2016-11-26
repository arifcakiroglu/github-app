<template>
  <div class="dahsboard">
    <nav>
      <ul>
        <li class="avatar" v-if="owner">
          <img v-bind:src="owner.avatar_url"  alt="" />
        </li>
      </ul>
      <div class="logout" v-on:click="removeTokens()">
        <router-link :to="{ name: 'login' }" >Log out</router-link>
      </div>
    </nav>
    <aside>
      <ul>
        <li class="owner"><strong>User:</strong> <a :href="owner.html_url">{{owner.login}}</a></li>
        <li v-for="repo in repositories">
          <a v-on:click="getRepoDetails(repo.name)" v-bind:class="{ fork: repo.fork, private: repo.private }">
            {{ repo.name }}
            <span :class="repo.language" v-show="repo.language">{{repo.language}}</span>
          </a>
        </li>
      </ul>
    </aside>
    <div class="content">
      <div v-html="content" class="markdown-body"></div>
    </div>
  </div>
</template>

<script>
  import base64 from 'base-64'
  import MarkdownIt from 'markdown-it'
  import $ from 'jquery'

  const {shell} = require('electron')
  const md = new MarkdownIt()

  $(function(){
    $(document).on('click', '.markdown-body a[href^="http"], .owner a', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });
  })

  export default {
    data() {
      return {
        repositories: {},
        owner: false,
        content: null
      }
    },

    created: function () {
        this.getRepo();
    },

    methods: {
      removeTokens(){
        window.localStorage.clear()
      },
      getAuthHeader() {
        return {
          'Authorization': 'Bearer ' + window.localStorage.getItem('bearer')
        }
      },
      getRepoDetails(name){
         this.$http.get(`https://github-service.herokuapp.com/api/repositories/${name}/readme`,{
            headers: this.getAuthHeader()
         }).then((response) => {
           this.$set(this, 'content', md.render(base64.decode(response.body.data.content)));
         }, (response) => {

         });
      },
      getRepo() {

         this.$http.get('https://github-service.herokuapp.com/api/repositories',{
            headers: this.getAuthHeader()
         }).then((response) => {
           this.$set(this, 'repositories', response.body.data);
           this.$set(this, 'owner', response.body.data[0].owner);
           this.getRepoDetails(response.body.data[0].name)

         }, (response) => {

         });
      }
    }
  }

</script>

<style lang="scss">

body{
  > div{
    width: 100%
  }
}

.dahsboard{
  display: flex;
}

.avatar{
  img{
    width: 50px;
  }
}

nav{
  position: fixed;
  left: 0;
  top: 0;
  background-color: #482c76;
  width: 80px;
  height: 100%;
  padding-top:50px;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  .logout{
    position: absolute;
    bottom: 0;
    left:0;
    background-color: rgba(0,0,0,.2);
    display: block;
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
    a{
      line-height: 60px;
      display: block;
    }
    &:hover{
      background-color: rgba(0,0,0,.4)
    }
  }

  a{
    color:#fff;
  }
  img{
    border-radius: 50%;
  }
}

aside{
  width: 280px;
  height: 100%;
  overflow: auto;
  text-align: left;
  position: fixed;
  left:80px;
  top:0;
  z-index: 10;
  background: #fff;
  color:#333;
  border-right: 1px solid #e5e5e5;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  margin-top: 50px;
  li{
    list-style: none inside;

    &.owner{
      -webkit-user-select: none;
      -webkit-app-region: drag;
      background: #fff9ea;
      line-height: 50px;
      padding-left:10px;
      position: fixed;
      top:0;
      z-index: 10;
      width: 280px;
      strong{
        font-size: 13px;
      }
      a{
        background: none;
        padding: 0;
        display: inline-block;
        border:0;
        line-height: normal;
      }
    }
    a{
      line-height: 36px;
      color:#4078c0;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      border-bottom: 1px solid #e5e5e5;
      padding: 0 15px 0 25px;
      display: block;
      cursor: pointer;
      background: url('dashboard/assets/repo.png') no-repeat 6px 50%;
      position: relative;
      &:hover{
        text-decoration: underline;
      }
      &.fork{
        background-image: url('dashboard/assets/fork.png');
      }
      &.private{
        background-image: url('dashboard/assets/fork.png');
      }

      span{
        position: absolute;
        top:10px;
        right: 3px;
        font-size: 10px;
        font-weight: 300;
        text-transform: uppercase;
        color: #fff;
        background-color: #4078c0;
        border-radius: 3px;
        padding: 1px 3px;
        display: inline-block;
        line-height: normal;

        &.CSS{
          background-color:#563d7c;
        }

        &.JavaScript{
          background-color: darken(#f1e05a, 20%);
        }

        &.HTML{
          background-color: #e44b23;
        }
      }
    }
  }
}

.content{
  width: 100%;
  margin-left: 360px;
  background-color: #fff;
  overflow: hidden;
  overflow-y: auto;

  .markdown-body{
    padding:20px;
    margin:20px 0;
    text-align:left;
    position:relative;
    display:block;
  }
}
</style>
