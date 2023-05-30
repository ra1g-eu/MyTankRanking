<template>
  <div class="row gx-4 gy-1 shadow-sm">
    <h2>Editor</h2>
    <div class="col-4">
    <button @click="loginOpenIdWG" class="btn btn-danger">Wargaming LOGIN</button>
    <div v-if="playerInfo.length > 0">
      <ul v-for="(player, index) in playerInfo" :key="index">
        <li>Player Name: {{ player.playerName }}</li>
      <li>
        Account Id: {{ player.accId }}
      </li>
        <li>
          Expiration Date: {{new Date(player.expiresAt * 1e3).toUTCString()}}
        </li>
      </ul>
      <button class="btn btn-primary" @click="logOutOpenIdWG">Log out</button>
    </div>
      <div v-else-if="requestStatus.length > 0">
        <ul v-for="(status, index) in requestStatus" :key="index">
          <li>Login status: {{ status.status }}</li>
          <li>
            Message: {{ status.message }}
          </li>
          <li>
            Error code: {{status.code}}
          </li>
        </ul>
      </div>
    </div>
    <router-link :to="{name: 'helloworld', params: {id: 2}}" class="link-danger">dva</router-link>
    <router-link :to="{name: 'helloworld', params: {id: 3}}" class="link-danger">tri</router-link>
    <button @click="getArticle(2)" class="btn btn-danger">Dva</button>
    <button class="btn btn-danger" @click="saveMarkdown">save markdown to db</button>
    <div>
      <textarea :value="source" @input="update" style="width: 100%"></textarea>
      <Markdown ref="mkdn" :source="source"/>
    </div>
  </div>
</template>

<script>
import Markdown from 'vue3-markdown-it';
import 'highlight.js/styles/sunburst.css';

export default {
  name: 'HelloWorld',
  components: {
    Markdown
  },
  data() {
    return {
      source: '# Hello World!',
      playerInfo: [],
      requestStatus: []
    }
  },
  created() {
    if (typeof this.$route.params.id === "string") {
      this.getArticle();
    }
  },
  mounted() {
    //this.getArticle();
    this.getPlayerInfo();
  },
  methods: {
    update(e) {
      this.source = e.target.value;
    },
    async loginOpenIdWG() {
      try {
        window.location.href=this.$apiUrl +'wg/auth/login';
      } catch (err) {
        console.log(err);
      }
    },
    async logOutOpenIdWG() {
      try {
        window.location.href=this.$apiUrl +'wg/auth/logout/'+this.playerInfo.accessToken;
      } catch (err) {
        console.log(err);
      }
    },
    getPlayerInfo(){
      this.playerInfo = [] ;
      this.requestStatus = [];
      if (this.$route.query.status === 'ok' && this.$route.query.access_token != null) {
        this.playerInfo = [{
          playerName: this.$route.query.nickname,
          accId: this.$route.query.account_id,
          expiresAt: this.$route.query.expires_at,
          accessToken: this.$route.query.access_token
        }];
      } else if(this.$route.query.status === 'error'){
        this.requestStatus = [{status: this.$route.query.status, message: this.$route.query.message, code: this.$route.query.code}]
      }
    },
    async getArticle(id) {
      try {
        await this.$axios.get(this.$apiUrl + `getArticle/${id == null ? this.$route.params.id : id}`).then(response => {
          if (response.data.status == 'success') {
            this.source = response.data.message[0].article
          } else {
            console.log(response.data.message);
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    async saveMarkdown() {
      try {
        await this.$axios.post(this.$apiUrl + "saveArticle", {
          article_core: this.source,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
