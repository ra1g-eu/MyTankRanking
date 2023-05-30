<template>
  <v-row>
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
    <v-container v-if="isError">
      <v-row no-gutters justify="center">
        <v-col cols="6">
          <v-card>
            <v-card-header>
              <v-icon color="primary"
                      :icon="requestStatus.status == 'success' ? 'mdi-checkbox-marked' : 'mdi-alert-box'"
                      class="me-3"></v-icon>
              {{ requestStatus.status.toUpperCase() }}
            </v-card-header>
            <v-card-text>
              {{ requestStatus.message }}
            </v-card-text>
            <v-card-actions v-if="requestStatus.status == 'success'">
              <v-spacer></v-spacer>
              <v-btn variant="contained" @click="$router.push({path: '/'})" color="red darken-5"
                     prepend-icon="mdi-check">Go Home
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else-if="!isLoading & !isError">
      <v-row>
        <v-container class="pa-0 ma-0">
          <v-col cols="12">
            <v-card-title class="pa-0 ma-0">Player {{this.$route.params.sharecode}}'s rankings</v-card-title>
          </v-col>
        </v-container>
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <v-icon icon="mdi-numeric" class="mx-1"></v-icon>
              Tanks in garage
            </v-card-title>
            <v-card-text>
              12
            </v-card-text>
          </v-card>
        </v-col>
          <v-col cols="6">
            <v-card>
              <v-card-title>
                <v-icon icon="mdi-star-half-full" class="mx-1"></v-icon>
                Average tank score
              </v-card-title>
              <v-card-text>
                /10</v-card-text>
            </v-card>
          </v-col>
      </v-row>
      <v-container>
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
          <v-lazy
              v-model="isActive"
              :options="{ threshold: .1 }"
              transition="fade-transition">
          <v-card
              dark
              :style="tank.is_premium === 1 ? 'border: 1px solid orange;' : ''"
              class="d-grid flex-shrink-0"
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
            <v-card-text class="align-middle align-center text-center">
              <h3>{{ tank.avgrank.toFixed(1) }}/10</h3>
              <v-rating
                  density="comfortable"
                  readonly
                  v-model="tank.avgrank"
                  :item-labels="['Why', '', '', '', '', '', '', 'Great']"
                  length="10"
                  color="grey"
                  active-color="orange darken-5"
                  hover
                  half-increments
              ></v-rating>
              <v-textarea
                  density="compact"
                  readonly
                  auto-grow=""
                  no-resize=""
                  rows="2"
                  v-model="tank.tankDesc"
                  background-color="amber lighten-4"
                  color="orange orange-darken-4"
                  label="Player's thoughts"
              ></v-textarea>
            </v-card-text>
          </v-card>
          </v-lazy>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<script>
export default {
  name: "SharePage",
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
      isActive: false,
      isLoading: false,
      tankShareList: [],
      requestStatus: [],
      isError: false,
    }
  },
  computed: {
    filterTankByName() {
      let filteredTanks = this.tankShareList;
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
          return a.ranking - b.ranking;
        });
      }
      if (this.sortTanks === 'Ranking Highest' && this.sortTanks) {
        filteredTanks = filteredTanks.sort((a, b) => {
          return b.ranking - a.ranking;
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
    document.title = 'MyTankRank.ink - Player ' + this.$route.params.sharecode + '\'s rankings';
  },
  created() {
    if (!this.$route.params.sharecode) {
      this.isError = true;
      this.requestStatus = {
        'status': 'error',
        'message': 'Please provide a shared link ID!'
      }
    } else {
      this.getSharedTanks();
    }
  },
  methods: {
    async getSharedTanks() {
      this.isLoading = true;
      try {
        await this.$axios.get(this.$apiUrl + "api/mtr/getTanksFromSharedLink/" + this.$route.params.sharecode,).then(response => {
          if (response.data.status == 'success') {
            this.tankShareList = response.data.message;
            setTimeout(() => {
              this.isLoading = false;
            }, 100);
          } else {
            this.isLoading = false;
            //console.log(response.data.message);
          }
        });
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        this.tankShareList = [];
        if (err != null) {
          this.requestStatus = err.response.data;
        }
      }
    }
  }
}
</script>

<style scoped>

</style>