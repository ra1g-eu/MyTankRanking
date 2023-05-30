import HelloWorld from "@/components/HelloWorld";
import HomePage from "@/components/HomePage";
import LoginPage from "@/components/LoginPage";
import SearchTanks from "@/components/SearchTanks";
import MyGarage from "@/components/MyGarage";
import RegisterPage from "@/components/RegisterPage";
import VerifyEmail from "@/components/VerifyEmail";
import BrowseRankings from "@/components/BrowseRankings";
import SharePage from "@/components/SharePage";
import ManageTanksPage from "@/components/AdminPanel/ManageTanksPage";

export const routes = [
    {
        name: 'home',
        path: '/:logout?',
        component: HomePage,
    },
    {
        name: 'helloworld',
        path: '/hw/:id?',
        component: HelloWorld
    },
    {
        name: 'loginpage',
        path: '/login',
        component: LoginPage
    },
    {
        name: 'searchtanks',
        path: '/search',
        component: SearchTanks
    },
    {
        name: 'mygarage',
        path: '/garage',
        component: MyGarage
    },
    {
        name: 'registerpage',
        path: '/register',
        component: RegisterPage
    },
    {
        name: 'verifyemail',
        path: '/verify/:userid/:token',
        component: VerifyEmail
    },
    {
        name: 'browserankings',
        path: '/rankings',
        component: BrowseRankings
    },
    {
        name: 'sharepage',
        path: '/share/:sharecode',
        component: SharePage
    },
    {
        name: 'admin_managetankspage',
        path: '/adminpanel/managetanks',
        component: ManageTanksPage
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: "/"
    },
]