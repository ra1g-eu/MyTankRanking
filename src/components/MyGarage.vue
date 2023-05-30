<template>
  <v-row justify="center">
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
            <v-card-title class="pa-0 ma-0">My Account</v-card-title>
          </v-col>
        </v-container>
        <v-col cols="12" lg="4" md="4" sm="12">
          <v-card>
            <v-card-title>
              <v-icon icon="mdi-numeric" class="mx-1"></v-icon>
              Tanks in garage
            </v-card-title>
            <v-card-text>
              {{ this.accountStats.tankCount }}
            </v-card-text>
          </v-card>
          <v-divider vertical="" color="transparent"></v-divider>
          <v-card>
            <v-card-title>
              <v-icon icon="mdi-star-half-full" class="mx-1"></v-icon>
              Average tank score
            </v-card-title>
            <v-card-text>
              {{
                this.accountStats.avgRank == '-' ? this.accountStats.avgRank : this.accountStats.avgRank.toFixed(1)
              }}/10</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4" md="4" sm="12">
          <v-card>
            <v-card-title>
              <v-icon icon="mdi-share-variant" class="mx-1"></v-icon>
              Share my garage
            </v-card-title>
            <v-card-text>
              <v-btn
                  color="green darken-5"
                  @click="copyLinkToClipBoard"
                  :append-icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                  variant="contained"
              >{{ shareBtnText }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4" md="4" sm="12">
          <v-card>
            <v-card-title>
              <v-icon icon="mdi-account-cog" class="mx-1"></v-icon>
              My Account
            </v-card-title>
            <v-card-text>
              <v-row no-gutters justify="center">
                <v-col cols="12">
                  <v-timeline direction="horizontal">
                    <v-timeline-item
                        icon="mdi-calendar-clock"
                        icon-color="black"
                        dot-color="orange darken-5"
                    >
                      <template v-slot:opposite>
                        {{
                          new Date(this.$store.getters.getUser.last_login).toLocaleString()
                        }}
                      </template>
                      Last Login
                    </v-timeline-item>

                    <v-timeline-item
                        icon="mdi-calendar-plus"
                        icon-color="black"
                        dot-color="orange darken-5">
                      <template v-slot:opposite>
                        Registered
                      </template>
                      {{
                        new Date(this.$store.getters.getUser.created_at).toLocaleString()
                      }}
                    </v-timeline-item>
                  </v-timeline>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="contained" color="red darken-5" prepend-icon="mdi-alert">Delete
                account
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-container class="pa-0 ma-0">
          <v-col cols="12">
            <v-card-title class="pa-0 ma-0">My Garage</v-card-title>
          </v-col>
        </v-container>
        <v-row>
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
            <v-row>
              <v-col
                  v-for="(tank, index) in filterTankByName"
                  :key="index"
                  xl="3"
                  lg="4"
                  sm="12"
                  md="6">
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
                    <v-card-subtitle>Last updated: {{ new Date(tank.updated_at).toLocaleString() }}</v-card-subtitle>
                    <v-img max-height="75" :src="tank.tank_icon.replace('http://','https://')">
                    </v-img>
                    <v-card-text class="text-center pa-1 ma-1">
                      <h3>{{ tank.ranking }}/10</h3>
                      <v-rating
                          density="comfortable"
                          class="mt-2 mb-4"
                          v-model="tank.ranking"
                          dense
                          length="10"
                          color="grey"
                          active-color="orange darken-5"
                          size="180%"
                          @click="sortTanks = ''"
                          hover
                          half-increments
                      ></v-rating>
                      <v-textarea
                          density="compact"
                          class="ma-0 pa-0"
                          dense
                          auto-grow=""
                          no-resize=""
                          rows="2"
                          v-model="tank.description"
                          :rules="rulesDesc"
                          counter
                          hint="Short description of this tank"
                          maxlength="200"
                          background-color="amber lighten-4"
                          color="orange orange-darken-4"
                          label="My thoughts"
                      ></v-textarea>
                    </v-card-text>
                    <v-row no-gutters="">
                      <v-col>
                        <v-btn
                            color="orange darken-5"
                            dense
                            block
                            small
                            class="pa-0 ma-0 rounded-0 rounded-s"
                            append-icon="mdi-delete"
                            @click="removeTank(tank.wg_tank_id, index)"
                            variant="text">Remove
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn color="green darken-5"
                               dense
                               block
                               small
                               class="pa-0 ma-0 rounded-0 rounded-e"
                               append-icon="mdi-check"
                               @click="saveNewRanking(tank.wg_tank_id, tank.ranking, tank.description)"
                               variant="contained-text">Save
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-lazy>
              </v-col>
            </v-row>
          </v-container>
        </v-row>
      </v-row>
    </v-container>
  </v-row>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "MyGarage",
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
      copied: false,
      shareBtnText: 'Generate share link',
      isLoading: false,
      garageTankList: [],
      tankSearchName: '',
      resetButton: false,
      sortTanks: 'Ranking Highest',
      sortOptions: ['','Tier Highest', 'Tier Lowest', 'Name Ascending', 'Name Descending', 'Ranking Highest', 'Ranking Lowest'],
      rules: [v => v.length <= 10 || 'Max 10 characters'],
      accountStats: {'tankCount': 0, 'avgRank': '-'},
      rulesDesc: [v => v.length <= 200 || 'Max 200 characters'],
    }
  },
  computed: {
    filterTankByName() {
      let filteredTanks = this.garageTankList;
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
    document.title = 'MyTankRank.ink - My Garage';
    this.loadTanksFromGarage();
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
    async copyLinkToClipBoard() {
      try {
        await this.$axios.get(this.$apiUrl + "api/mtr/generateShareLink").then(response => {
          if (response.data.status == 'success') {
            if (response.data.message.sharedLink.includes('https://')) {
              navigator.clipboard.writeText(response.data.message.sharedLink);
              this.copied = true;
              this.shareBtnText = 'Copied!';
            }
          } else {
            console.log(response.data.message);
          }
        });
      } catch (err) {
        Swal.fire({
          title: "My Garage",
          text: err.response.data.message,
          icon: "warning",
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.close();
          }
        });
      }
    },
    async loadTanksFromGarage() {
      this.isLoading = true;
      try {
        await this.$axios.get(this.$apiUrl + "api/mtr/loadTanksFromGarage").then(response => {
          if (response.data.status == 'success') {
            //console.log(response.data.message.account[0]);
            this.accountStats = response.data.message.account[0];
            this.garageTankList = response.data.message.tanks;
            //console.log(response.data.message.tanks);
            this.isLoading = false;
          } else {
            this.accountStats = {'tankCount': 0, 'avgRank': '-'}
            this.isLoading = false;
            console.log(response.data.message);
          }
        });
      } catch (err) {
        if (err.response.data.message !== 'You currently have no tanks in garage.') {
          Swal.fire({
            title: "My Garage",
            text: err.response.data.message,
            icon: "warning",
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.close();
            }
          });
        }
        this.accountStats = {'tankCount': 0, 'avgRank': '-'}
        this.isLoading = false;
        //console.log(err.response.data);
      }
    },
    async saveNewRanking(tankId, rank, desc) {
      try {
        await this.$axios.put(this.$apiUrl + "api/mtr/saveNewRanking", {
          'tankId': tankId,
          'ranking': parseFloat(rank),
          'description': desc
        }).then(response => {
          if (response.data.status == 'success') {
            Swal.fire({
              title: "My Garage",
              text: response.data.message,
              icon: "success",
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this.loadTanksFromGarage();
                Swal.close();
              }
            });
          } else {
            console.log(response.data.message);
          }
        });
      } catch (err) {
        console.log(err);
        Swal.fire({
          title: "My Garage",
          text: err.response.data.message,
          icon: "warning",
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.close();
          }
        });
        //console.log(err.response.data);
      }
    },
    async removeTank(tankId, index) {
      Swal.fire({
        title: "My Garage",
        text: 'Are you sure you want to remove this tank?',
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes',
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.close();
          try {
            await this.$axios.post(this.$apiUrl + "api/mtr/removeTankFromGarage", {
              'tankId': tankId
            }).then(response => {
              if (response.data.status == 'success') {
                Swal.fire({
                  title: "My Garage",
                  text: response.data.message,
                  icon: "success",
                  confirmButtonText: 'OK',
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.close();
                  }
                });
                this.garageTankList.splice(index, 1);
              } else {
                console.log(response.data.message);
              }
            });
          } catch (err) {
            Swal.fire({
              title: "My Garage",
              text: err.response.data.message,
              icon: "warning",
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.close();
              }
            });
            //console.log(err.response.data);
          }
        }
      });
    }
  }
}
</script>

<style scoped>

</style>