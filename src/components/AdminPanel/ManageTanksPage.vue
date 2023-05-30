<template>
  <v-container>
    admin page
  </v-container>
</template>

<script>
export default {
  name: "ManageTanksPage",
  data() {
    return {}
  },
  beforeCreate() {
      this.$axios.get(this.$apiUrl + "api/mtr/checkIfAdmin").then(response => {
        if (response.data.status === 'error') {
          this.$router.push({path: '/error/403'});
        }
      }).catch((err) => {
        if (err.response.data.status === 'error') {
          this.$router.push({path: '/error/403'});
        }
      });
  },
  methods:{
  }
}
</script>

<style scoped>

</style>