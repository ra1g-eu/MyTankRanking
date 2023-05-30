<template>
  <v-row justify="center">
    <v-container v-if="isError">
      <v-row no-gutters justify="center">
        <v-col cols="6">
          <v-card>
            <v-card-header>
              <v-icon color="primary" :icon="requestStatus.status == 'success' ? 'mdi-checkbox-marked' : 'mdi-alert-box'" class="me-3"></v-icon> {{requestStatus.status.toUpperCase()}}
            </v-card-header>
            <v-card-text>
              {{requestStatus.message}}
            </v-card-text>
            <v-card-actions v-if="requestStatus.status == 'success'">
              <v-spacer></v-spacer>
              <v-btn variant="contained" @click="$router.push({path: '/'})" color="red darken-5" prepend-icon="mdi-check">Go Home</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="isLoading">
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
      <v-row>
        <v-container class="pa-0 ma-0">
          <v-col cols="12">
            <v-card-title class="pa-0 ma-0">Browse Rankings</v-card-title>
            <v-card-subtitle class="pa-0 ma-0">Rankings are refreshed every hour.</v-card-subtitle>
          </v-col>
        </v-container>
        <v-container fluid class="mb-2 pa-0 border border-5 rounded border-warning align-center">
          <v-row justify="center" class="ma-3">
            <v-col cols="12" lg="6" sm="12" md="6" xl="3">
              <v-text-field
                  v-model="tankSearchName"
                  :rules="rules"
                  counter
                  maxlength="10"
                  hint="WZ-111, 703, T30..."
                  label="Search for a tank..."
                  clearable
                  rounded
                  dense
                  size="100"
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col
                class="d-flex"
                cols="12"
                md="6"
                lg="6"
                sm="12"
                xl="3"
            >
              <v-select
                  :items="sortOptions"
                  v-model="sortTanks"
                  label="Sort by"
                  hide-details
              ></v-select>
            </v-col>
            <v-col
                class=""
                cols="12"
                md="6"
                lg="4"
                sm="12"
                xl="2">
              <v-list>
                <v-list-item density="compact" class="justify-center">
                  <v-btn-toggle
                      background-color="info"
                      multiple
                  >
                    <v-btn color="info" size="small" @click="showPremiumFilter = !showPremiumFilter">
                      Premium
                    </v-btn>

                    <v-btn color="info" size="small" @click="showTechtreeFilter = !showTechtreeFilter">
                      Techtree
                    </v-btn>
                  </v-btn-toggle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col
                class=""
                cols="12"
                md="6"
                lg="4"
                sm="12"
                xl="3">
              <v-list>
                <v-list-item density="compact" class="justify-center">
                  <v-btn-toggle
                      v-model="toggleExclusive"
                      dense
                      background-color="info"
                  >
                    <v-btn color="info" size="small" @click="showTDFilter = !showTDFilter; showHTFilter = false; showMTFilter = false; showLTFilter = false; showSPGFilter = false;">
                      TD
                    </v-btn>

                    <v-btn color="info" size="small" @click="showHTFilter = !showHTFilter; showTDFilter = false; showMTFilter = false; showLTFilter = false; showSPGFilter = false;">
                      HT
                    </v-btn>
                    <v-btn color="info" size="small" @click="showMTFilter = !showMTFilter; showTDFilter = false; showHTFilter = false; showLTFilter = false; showSPGFilter = false;">
                      MT
                    </v-btn>
                    <v-btn color="info" size="small" @click="showLTFilter = !showLTFilter; showTDFilter = false; showHTFilter = false; showMTFilter = false; showSPGFilter = false;">
                      LT
                    </v-btn>
                    <v-btn color="info" size="small" @click="showSPGFilter = !showSPGFilter; showTDFilter = false; showHTFilter = false; showLTFilter = false; showTDFilter = false;">
                      SPG
                    </v-btn>
                  </v-btn-toggle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col
                class="d-flex"
                cols="12"
                md="12"
                lg="4"
                sm="12"
                xl="1">
              <v-btn
                  block
                  color="orange darken-5"
                  v-model="resetButton"
                  @click="resetFilter"
                  append-icon="mdi-refresh"
                  variant="contained"
                  min-height="100%"
              >Reset
              </v-btn>
            </v-col>
          </v-row>
      </v-container>
        <v-row>
          <v-col
            v-for="(tank, index) in filterTankByName"
            :key="index"
            xl="3"
            lg="4"
            sm="12"
            md="6"
        >
          <v-card
              dark
              :style="tank.is_premium === 1 ? 'border: 1px solid orange;' : ''"
              class="d-grid flex-shrink-0 ma-0 pa-0"
          >
            <v-card-title class="text-h6">
              {{ convertNationToFlag(tank.nation) }} {{ tank.short_name }}
              <v-icon icon="mdi-chevron-right" size="x-small" class="" color="orange darken-5"></v-icon>
              {{ convertArabicToRoman(tank.tier) }}
              <v-icon icon="mdi-chevron-right" size="x-small" color="orange darken-5"></v-icon>
              {{ tank.type.toUpperCase() }}
            </v-card-title>
            <v-img max-height="75" :src="tank.tank_icon.replace('http://','https://')">
            </v-img>
            <v-card-text class="text-center pa-1 ma-1">
              <h3>{{ tank.avgrank.toFixed(1) }}/10</h3>
              <v-rating
                  v-model="tank.avgrank"
                  readonly
                  density="comfortable"
                  class="mt-2 mb-4"
                  clearable=""
                  dense
                  length="10"
                  color="grey"
                  active-color="orange darken-5"
                  size="180%"
                  hover
                  half-increments
              ></v-rating>
            </v-card-text>
            <v-btn
                dense
                block
                color="info"
                prepend-icon="mdi-account-star"
                size="large"
                title="Number of people that ranked this tank"
                disabled
                variant="contained-text">{{ tank.numOfRankings }}
            </v-btn>
          </v-card>
        </v-col>
        </v-row>
      </v-row>
    </v-container>
    </v-row>
</template>

<script>
export default {
  name: "BrowseRankings",
  data() {
    return {
      toggleExclusive: null,
      showTDFilter: false,
      showHTFilter: false,
      showMTFilter: false,
      showLTFilter: false,
      showSPGFilter: false,
      showTechtreeFilter: false,
      showPremiumFilter: false,
      isLoading: false,
      tankRankingsList: [],
      isError: false,
      requestStatus: [],
      tankSearchName: '',
      resetButton: false,
      sortTanks: 'Ranking Highest',
      sortOptions: ['Tier Highest', 'Tier Lowest', 'Name Ascending', 'Name Descending', 'Ranking Highest', 'Ranking Lowest', '# of Rankings Highest', '# of Rankings Lowest'],
      rules: [v => v.length <= 10 || 'Max 10 characters'],
    }
  },
  computed: {
    filterTankByName() {
      let filteredTanks = this.tankRankingsList;
      if(this.showPremiumFilter == true && this.showTechtreeFilter == false){
        filteredTanks = filteredTanks.filter((item) => {

          return item.is_premium == '1';

        });
      }
      if(this.showTechtreeFilter == true && this.showPremiumFilter == false){
        filteredTanks = filteredTanks.filter((item) => {

          return item.is_premium == '0';

        });
      }
      if(this.showTechtreeFilter == true && this.showPremiumFilter == true){
        filteredTanks = filteredTanks.filter((item) => {

          return item.is_premium != null;

        });
      }
      if(this.showTDFilter == true){
        filteredTanks = filteredTanks.filter((item) => {

          return item.type == 'td';

        });
      }
      if(this.showHTFilter == true){
        filteredTanks = filteredTanks.filter((item) => {

          return item.type == 'ht';

        });
      }
      if(this.showMTFilter == true){
        filteredTanks = filteredTanks.filter((item) => {

          return item.type == 'mt';

        });
      }
      if(this.showLTFilter == true){
        filteredTanks = filteredTanks.filter((item) => {

          return item.type == 'lt';

        });
      }
      if(this.showSPGFilter == true){
        filteredTanks = filteredTanks.filter((item) => {

          return item.type == 'spg';

        });
      }
      if (this.tankSearchName != '' && this.tankSearchName) {
        filteredTanks = filteredTanks.filter((item) => {

          return item.short_name
              .toUpperCase()
              .includes(this.tankSearchName.toUpperCase())

        });
      }
      if (this.sortTanks === 'Tier Lowest' && this.sortTanks) {
        filteredTanks = filteredTanks.sort((a, b) => {
          return a.tier - b.tier;
        });
      }
      if (this.sortTanks === 'Tier Highest' && this.sortTanks) {
        filteredTanks = filteredTanks.sort((a, b) => {
          return b.tier - a.tier;
        });
      }
      if (this.sortTanks === 'Ranking Lowest' && this.sortTanks) {
        filteredTanks = filteredTanks.sort((a, b) => {
          return a.avgrank - b.avgrank;
        });
      }
      if (this.sortTanks === 'Ranking Highest' && this.sortTanks) {
        filteredTanks = filteredTanks.sort((a, b) => {
          return b.avgrank - a.avgrank;
        });
      }
      if (this.sortTanks === '# of Rankings Lowest' && this.sortTanks) {
        filteredTanks = filteredTanks.sort((a, b) => {
          return a.numOfRankings - b.numOfRankings;
        });
      }
      if (this.sortTanks === '# of Rankings Highest' && this.sortTanks) {
        filteredTanks = filteredTanks.sort((a, b) => {
          return b.numOfRankings - a.numOfRankings;
        });
      }
      if (this.sortTanks === 'Name Ascending' && this.sortTanks) {
        filteredTanks = filteredTanks.sort((a, b) => {
          let fa = a.short_name.toLowerCase(), fb = b.short_name.toLowerCase();
          if (fa < fb) {
            return -1
          }
          if (fa > fb) {
            return 1
          }
          return 0
        })
      }
      if (this.sortTanks === 'Name Descending' && this.sortTanks) {
        filteredTanks = filteredTanks.sort((a, b) => {
          let fa = a.short_name.toLowerCase(), fb = b.short_name.toLowerCase();
          if (fa > fb) {
            return -1
          }
          if (fa < fb) {
            return 1
          }
          return 0
        })
      }
      return filteredTanks;
    }
  },
  mounted() {
    if(!localStorage.getItem('MTR_RankingsLastUpdate')) {
      localStorage.setItem('MTR_RankingsLastUpdate', Date.now().toString());
      this.showRankingsBasedOnFilter();
    } else if((Date.now() - parseInt(localStorage.getItem('MTR_RankingsLastUpdate'))) >= 3600000){
      this.showRankingsBasedOnFilter();
      localStorage.setItem('MTR_RankingsLastUpdate', Date.now().toString());
    } else {
      this.isLoading = true;
      this.tankRankingsList = JSON.parse(localStorage.getItem('MTR_BrowseRankingsData'));
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
    }
  },
  created() {
    document.title = 'MyTankRank.ink - Browse Rankings';
  },
  methods: {
    resetFilter(){
      this.toggleExclusive = null;
      this.showTDFilter = false;
      this.showHTFilter = false;
      this.showMTFilter = false;
      this.showLTFilter = false;
      this.showSPGFilter = false;
      this.showPremiumFilter = false;
      this.showTechtreeFilter = false;
      this.resetButton = !this.resetButton;
      this.tankSearchName = '';
      this.sortTanks = 'Ranking Highest';
    },
    async showRankingsBasedOnFilter() {
      this.isLoading = true;
      try {
        await this.$axios.get(this.$apiUrl + "api/mtr/browseRankings").then(response => {
          if (response.data.status == 'success') {
            this.tankRankingsList = response.data.message;
            localStorage.setItem('MTR_BrowseRankingsData', JSON.stringify(this.tankRankingsList));
            this.isLoading = false;
            this.isError = false;
          } else {
            this.isLoading = false;
            //console.log(response.data.message);
          }
        });
      } catch (err) {
        this.isLoading = false;
        this.isError = true;
        this.tankRankingsList = [];
        if(err != null){
          this.requestStatus = err.response.data;
        }
      }
    },
  }
}
</script>

<style scoped>

</style>