<template>
  <v-app :theme="theme">
    <v-navigation-drawer
        app
        v-model="drawer">
      <template v-slot:prepend>
        <v-list-item v-if="this.$store.getters.isLoggedIn"
            two-line
            prepend-icon="mdi-shield-check"
            color="purple darken-5"
            :title=this.$store.getters.getUser.username
            subtitle="Logged in"
        ></v-list-item>
        <v-img v-else
            src="../src/assets/logo.png"
            height="64"
            class="bg-amber-darken-4"
        ></v-img>
      </template>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Home" value="goHome"
                     @click="$router.push({ path: '/' })"></v-list-item>

            <v-list-item v-bind="props" prepend-icon="mdi-playlist-star" title="Browse Rankings" value="browserankings" @click="$router.push({path: '/rankings'})"></v-list-item>

        <v-list-item prepend-icon="mdi-bell" title="Get Latest News" value="getnotification"
                     ></v-list-item>
        <v-list-item v-if="!this.$store.getters.isLoggedIn" prepend-icon="mdi-login" title="Log In" @click="$router.push({ path: '/login' })" value="signIn"></v-list-item>
        <v-list-item v-if="!this.$store.getters.isLoggedIn" prepend-icon="mdi-account-plus" title="Register" @click="$router.push({ path: '/register' })" value="signUp"></v-list-item>

        <v-divider></v-divider>

        <v-list-item v-if="this.$store.getters.isLoggedIn"
            one-line
            prepend-icon="mdi-shield-account"
            title="User Area"
            class="border border-primary border-5 border-md border-dashed mt-2 text-primary"
            rounded
        ></v-list-item>

        <v-list-item v-if="this.$store.getters.isLoggedIn" prepend-icon="mdi-feature-search-outline" @click="$router.push({ path: '/search' })"
                     title="Search Tanks" value="searchtanks"></v-list-item>
        <v-list-item v-if="this.$store.getters.isLoggedIn" prepend-icon="mdi-garage" title="My Garage" value="mygarage"
                     @click="$router.push({ path: '/garage' })"></v-list-item>
        <v-list-item v-if="this.$store.getters.isLoggedIn" prepend-icon="mdi-logout-variant" @click="logOutUser" class="text-red"
                     title="Log out" value="signout"></v-list-item>
        <v-divider></v-divider>
        <div v-if="this.$store.getters.isLoggedIn && this.$store.getters.getUser.role === 'superadmin'">
        <v-list-item v-if="this.$store.getters.isLoggedIn"
                     one-line
                     prepend-icon="mdi-shield-account"
                     title="Admin Area"
                     class="border border-warning border-5 border-md border-dashed mt-2 text-warning"
                     rounded
        ></v-list-item>

        <v-list-item prepend-icon="mdi-feature-search-outline" @click="$router.push({ path: '/adminpanel/' })"
                     title="Admin Panel" value="adminpanel"></v-list-item>
          <v-list-item prepend-icon="mdi-feature-search-outline" @click="$router.push({ path: '/adminpanel/managetanks' })"
                       title="Manage tanks" value="managetanks"></v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar prominent app>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My Tank Ranking</v-toolbar-title>
      0.1.5

      <v-btn variant="text" icon="mdi-theme-light-dark" @click="toggleTheme"></v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app
              class="text-center d-flex flex-column">
      <p class="text-caption">
        MyTankRank.ink is a hobby project and is in no way or shape affiliated with Wargaming.net and World Of Tanks.
      </p>

      <v-divider></v-divider>

      <div class="ma-0 text-caption">
        {{ new Date().getFullYear() }} — Created by
        <v-btn variant="text" color="orange darken-5" prepend-icon="mdi-shield-account" title="ra1g" density="compact"
               @click="showTomato">ra1g
        </v-btn>
        <v-btn
            density="compact"
            color="orange darken-5"
            icon="mdi-email"
            href="mailto:ra1g@protonmail.com"
            title="mailto:ra1g@protonmail.com"
            variant="text"
        ></v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<script>

//import {LocalNotifications} from '@capacitor/local-notifications';
import {ref} from "vue";

export default {

  name: 'App',

  setup() {
    const theme = ref('dark')

    return {
      theme,
      toggleTheme: () => theme.value = theme.value === 'light' ? 'dark' : 'light'
    }
  },
  mounted() {
    document.title = 'MyTankRank.ink - Give your tanks a rank!';
  },
  data: () => ({
    drawer: null,
    group: null,
    menu2: false,
    menu: false,
    tab: null
  }),

  watch: {
    group() {
      this.drawer = false
    },
  },
  methods: {
    toggleDarkMode: function() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    logOutUser() {
      this.$store.dispatch('logout');
      this.$router.replace({name: 'home', params: {logout: 'logoutSuccess'}});
    },
    /*checkLastNotif() {
      this.$nextTick(function () {
        this.$axios.post(this.$apiUrl + 'api/mtr/pushLastNotification', {
          lastClientNotif: this.lastNotifId,
        })
            .then(response => {
              if(response.data.status === 'success' && response.data.message == 'There are no new notifications.'){
                console.log('No new notifications.');
              } else if (response.data.status === 'success') {
                this.sendNotif(response.data.message[0].title, response.data.message[0].body_text, response.data.message[0].id);
              }
            })
            .catch(function (error) {
              console.error(error);
            });
      });
    },*/
    /*async sendNotif(title, text, id) {
      const canSend = await LocalNotifications.requestPermissions();
      if (canSend) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: title,
              body: text,
              id: id,
              schedule: {at: new Date(Date.now() + 1000 * 1.2)},
              actionTypeId: "",
              extra: null
            }
          ]
        });
        localStorage.MTRlastNotifId = id;
        localStorage.MTRlastNotifCheck = Math.round((new Date()).getTime() / 1000);
      } else {
        console.log("Xd");
      }
    },*/
    showTomato() {
      window.open('https://www.tomato.gg/stats/EU/ra1g=529602016', '_blank');
    }
  },
}
</script>
