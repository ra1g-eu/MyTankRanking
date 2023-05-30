<template>
<v-row justify="center">
  <v-container v-if="loading">
    <v-row justify="center">
      <v-col cols="6" class="text-center">
        <v-progress-circular
            indeterminate
            color="primary"
            size="55"
            class="text-center"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else>
    <v-row no-gutters justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-header>
            <v-icon color="primary" :icon="verifyStatus.status == 'success' ? 'mdi-checkbox-marked' : 'mdi-alert-box'" class="me-3"></v-icon> {{verifyStatus.status.toUpperCase()}}
          </v-card-header>
          <v-card-text>
            {{verifyStatus.message}}
          </v-card-text>
          <v-card-actions v-if="verifyStatus.status == 'success'">
            <v-spacer></v-spacer>
            <v-btn variant="contained" @click="$router.push({path: '/login'})" color="green darken-5" prepend-icon="mdi-check">Log In</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</v-row>
</template>

<script>
export default {
  name: "VerifyEmail",
  data(){
    return{
      userId: null,
      token: null,
      loading: false,
      verifyStatus: []
    }
  },
  async created() {
    document.title = 'MyTankRank.ink - Verify your email address';
    await this.verifyEmail();
  },
  methods:{
    async verifyEmail() {
      this.loading = true;
      this.userId = this.$route.params.userid;
      this.token = this.$route.params.token;
      try {
        await this.$axios.get(this.$apiUrl + `api/mtr/verify/` + this.userId + `/` + this.token).then(response => {
          if (response.data.status == 'success') {
            this.loading = false;
            this.verifyStatus = response.data;
          } else if(response.data.status == 'error'){
            this.loading = false;
            this.verifyStatus = response.data;
          }
        });
      } catch (err) {
        this.loading = false;
        this.verifyStatus = err.response.data;
        //console.log(err.response.data);
      }
    }
  }
}
</script>

<style scoped>

</style>