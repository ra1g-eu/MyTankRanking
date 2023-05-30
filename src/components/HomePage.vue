<template>
  <v-row justify="center">
    <v-alert v-if="this.$route.params.logout == 'logoutSuccess'" type="success" closable close-label="Close Alert">Successfully logged out! See you next time.
    </v-alert>
    <v-container>
      <v-col cols="12">
        Welcome to My Tank Ranking
      </v-col>
    </v-container>
  </v-row>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {}
  },
  mounted() {
    document.title = 'MyTankRank.ink - Give your tanks a rank!';
  },
  created() {
  },
  methods: {}
}
</script>

<style scoped>

</style>