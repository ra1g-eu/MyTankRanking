<template>
  <v-row justify="center">
    <v-col cols="12" sm="12" md="8" lg="5">
      <v-form v-model="valid">
        <v-container fluid>
          <v-card class="border border-warning border-5">
            <v-card-header class="fs-2">
              Register your account
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
              <v-row justify="center">
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="userpassword_repeat"
                      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[passRules.required, passRules.min, passRules.max]"
                      :type="show2 ? 'text' : 'password'"
                      name="userpassword_repeat"
                      label="Repeat password"
                      hint="At least 8 characters"
                      counter
                      @click:append="show2 = !show2"
                      size="50"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="useremail"
                      :rules="emailRules"
                      :counter="150"
                      :type="'email'"
                      label="E-mail"
                      required
                      size="50"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="contained" color="green darken-3" @click="registerUser" prepend-icon="mdi-check">Register</v-btn>
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
  name: "RegisterPage",
  data: () => ({
    show1: false,
    show2: false,
    valid: false,
    username: '',
    userpassword: '',
    userpassword_repeat: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => v.length <= 26 || 'Name must be less than 25 characters',
    ],
    useremail: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    passRules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
      max: v => v.length <= 501 || 'Password must be less than 500 characters',

    },
  }),
  mounted() {
    document.title = 'MyTankRank.ink - Register an account';
  },
  methods: {
    async registerUser() {
      try {
        await this.$axios.post(this.$apiUrl + "api/mtr/register", {
          username: this.username,
          userpassword: this.userpassword,
          userpassword_repeat: this.userpassword_repeat,
          useremail: this.useremail
        }).then(response => {
          if (response.data.status == 'success') {
            Swal.fire({title: "Register", text: response.data.message, icon: "success",confirmButtonText: 'OK'}).then((result) => {
              if (result.isConfirmed) {
                this.$router.push({ path: '/' });
              }
            });
          } else {
            Swal.fire({title: "Register", html: "Something went wrong:<br>" + response.data.message, icon: "warning"});
            //console.log(response.data.message);
          }
        });
      } catch (err) {
        await Swal.fire({title: "Register", html: "Something went wrong:<br>" + err.response.data.message, icon: "warning"});
        //console.log(err);
      }
    }
  }
}
</script>

<style scoped>

</style>