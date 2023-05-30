<template>
  <v-row justify="center">
    <v-col cols="12" sm="12" md="8" lg="5">
      <v-form v-model="valid">
        <v-container fluid>
          <v-card class="border border-warning border-5">
            <v-card-header class="fs-2">
              Log in to your account
            </v-card-header>
            <v-card-text>
              <v-row justify="center">
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="username"
                      :rules="nameRules"
                      :counter="25"
                      label="Nickname / username"
                      required
                      size="50"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="userpassword"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[passRules.required, passRules.min, passRules.max]"
                      :type="show1 ? 'text' : 'password'"
                      name="userpassword"
                      label="Password"
                      hint="At least 8 characters"
                      counter
                      @click:append="show1 = !show1"
                      size="50"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="contained" color="green darken-3" @click="logInUser" prepend-icon="mdi-check">Log in</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: "LoginPage",
  data: () => ({
    show1: false,
    valid: false,
    username: '',
    userpassword: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => v.length <= 26 || 'Name must be less than 25 characters',
    ],
    passRules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
      max: v => v.length <= 501 || 'Password must be less than 500 characters',
    },
  }),
  mounted() {
    document.title = 'MyTankRank.ink - Log In';
  },
  methods: {
    async logInUser() {
      try {
        await this.$axios.post(this.$apiUrl + "api/mtr/login", {
          username: this.username,
          userpassword: this.userpassword,
        }).then(response => {
          if (response.data.status == 'success') {
            const token = response.data.message.token;
            const user = response.data.message.user;
            this.$store.dispatch('login', {token, user});
            this.$router.push({ path: '/garage' });
            Swal.fire({title: "Log In", text: "Successfully logged in!", icon: "success",confirmButtonText: 'OK',}).then((result) => {
              if (result.isConfirmed) {
                Swal.close();
              }
            });
          } else if(response.data.status == 'error'){
            Swal.fire({title: "Log In", text: response.data.message, icon: "warning"});
            //console.log(response.data.message);
          }
        });
      } catch (err) {
        await Swal.fire({
          title: "Log In",
          html: "Something went wrong:<br>" + err.response.data.message,
          icon: "warning"
        });
        //console.log(err);
      }
    }
  }
}
</script>

<style scoped>

</style>