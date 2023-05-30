import axios from "axios";
import VueAxios from "vue-axios";
import {routes} from "./routes";
import Vuex from 'vuex';
import store from './store';
import {createRouter, createWebHistory} from "vue-router";
import './assets/css/fontawesome/css/all.css';
import {createApp} from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {loadFonts} from "@/plugins/webfontloader";
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import '@sweetalert2/theme-dark/dark.css';

loadFonts()

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark'
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
});

let appV = createApp(App);

appV.mixin({
    methods: {
        convertNationToFlag(flagCode) {
            switch (flagCode) {
                case 'uk':
                    return '🇬🇧';
                case 'ger':
                    return '🇩🇪';
                case 'swe':
                    return '🇸🇪';
                case 'ussr':
                    return '☭';
                case 'fr':
                    return '🇫🇷';
                case 'cz':
                    return '🇨🇿';
                case 'pl':
                    return '🇵🇱';
                case 'usa':
                    return '🇺🇸';
                case 'jp':
                    return '🇯🇵';
                case 'cn':
                    return '🇨🇳';
                case 'it':
                    return '🇮🇹'
                default:
                    return '🌎'
            }
        },
        convertArabicToRoman(arabicNumber) {
            switch (arabicNumber) {
                case 1:
                    return 'I';
                case 2:
                    return 'II';
                case 3:
                    return 'III';
                case 4:
                    return 'IV';
                case 5:
                    return 'V';
                case 6:
                    return 'VI';
                case 7:
                    return 'VII';
                case 8:
                    return 'VIII';
                case 9:
                    return 'IX';
                case 10:
                    return 'X';
                default:
                    return '0';
            }
        },
    },
});

appV.use(vuetify);
appV.use(router);
appV.use(store);
appV.use(Vuex);
appV.use(VueAxios, axios);
appV.mount('#app');

axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;
axios.defaults.headers.common['App-Request-Header'] = 'MyTankRank.ink/REQ/MTR/1.0.0';
appV.config.globalProperties.$axios = axios;
appV.config.globalProperties.$router = router;
appV.config.globalProperties.$store = store;
appV.config.globalProperties.$vuetify = vuetify;
//appV.config.globalProperties.$apiUrl = 'https://api.ra1g.eu/';
appV.config.globalProperties.$apiUrl = 'http://localhost:3000/';


router.beforeEach((to) => {
    if (!store.getters.isLoggedIn) {
        if (to.path.includes('/garage')) {
            router.push({path: '/login'});
        }
        if (to.path.includes('/search')) {
            router.push({path: '/login'});
        }
        if (to.path.includes('(/adminpanel') && store.getters.getUser.role !== 'superadmin') {
            router.push({path: '/login'});
        }
    }
});
