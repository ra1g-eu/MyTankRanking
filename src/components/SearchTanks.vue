<template>
  <v-row justify="center">
    <v-container class="pa-0 ma-0">
      <v-col cols="12">
        <v-card-title class="pa-0 ma-0">Search for tanks</v-card-title>
      </v-col>
    </v-container>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" lg="12">
            <v-text-field
                v-model="tankName"
                :rules="rules"
                counter
                maxlength="10"
                hint="WZ-111, 703, T30..."
                label="Enter tank name"
                clearable
                rounded
                dense
                required
                size="100"
                @keyup="searchTankInDB"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="foundTanks">
        <v-row>
          <v-col
              v-for="(tank, index) in tankList"
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
                  :style="tank.is_premium === 1 ? 'border: 1px solid orange;' : ''"
                  class="d-grid flex-shrink-0"
              >
                <v-card-title
                    class="text-h5"
                >{{ convertNationToFlag(tank.nation) }} {{ tank.short_name }}
                  <v-icon icon="mdi-chevron-right" size="x-small" class="" color="orange darken-5"></v-icon>
                  {{ convertArabicToRoman(tank.tier) }}
                  <v-icon icon="mdi-chevron-right" size="x-small" color="orange darken-5"></v-icon>
                  {{ tank.type.toUpperCase() }}
                </v-card-title>
                <v-img max-height="75" :src="tank.tank_icon.replace('http://','https://')">
                </v-img>
                <v-card-text class="text-center pa-1 ma-1">
                  <h3>{{ tank.rank ? tank.rank : '0' }}/10</h3>
                  <v-rating
                      density="comfortable"
                      class="mt-2 mb-4"
                      clearable=""
                      v-model="tank.rank"
                      dense
                      length="10"
                      color="grey"
                      active-color="orange darken-5"
                      size="180%"
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
                      v-model="tank.desc"
                      :rules="rulesDesc"
                      counter
                      hint="Short description of this tank"
                      maxlength="200"
                      background-color="amber lighten-4"
                      color="orange orange-darken-4"
                      label="My thoughts"
                  ></v-textarea>
                </v-card-text>
                <v-btn
                    dense
                    block
                    class="pa-0 ma-0 d-flex"
                    color="green darken-5"
                    append-icon="mdi-plus-box-multiple"
                    small
                    min-height="100%"
                    @click="addTankToGarage(tank.wg_tank_id, tank.rank, tank.desc, index)"
                    variant="contained-text">Add {{ tank.short_name }} to garage
                </v-btn>
              </v-card>
            </v-lazy>
          </v-col>
        </v-row>

      </v-container>
    </v-form>
    <v-container v-if="searchingTanks">
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
  </v-row>
</template>

<script>
// eslint-disable-next-line
import Swal from 'sweetalert2';

export default {
  name: "SearchTanks",
  data() {
    return {
      rules: [v => v.length <= 10 || 'Max 10 characters'],
      foundTanks: false,
      tankName: '',
      awaitingSearch: false,
      searchingTanks: false,
      isActive: false,
      tankList: [],
      rulesDesc: [v => v.length <= 200 || 'Max 200 characters'],
    }
  },
  mounted() {
    document.title = 'MyTankRank.ink - Search tanks from the game';
  },
  methods: {
    async searchTankInDB() {
      this.searchingTanks = true;
      if (this.tankName.length > 1 && this.tankName.length <= 10) {
        if (!this.awaitingSearch) {
          setTimeout(async () => {
            try {
              await this.$axios.post(this.$apiUrl + "api/mtr/searchTanks", {
                tankName: this.tankName,
                isPremium: '2'
              }).then(response => {
                if (response.data.status == 'success') {
                  this.tankList = response.data.message;
                  this.foundTanks = true;
                  this.searchingTanks = false;
                } else {
                  this.foundTanks = false;
                  this.searchingTanks = false;
                  console.log(response.data.message);
                }
              });
            } catch (err) {
              this.searchingTanks = false;
              this.foundTanks = false;
              console.log(err);
            }
            this.searchingTanks = false;
            this.awaitingSearch = false;
          }, 1500);
        }
        this.awaitingSearch = true;
      } else {
        this.foundTanks = false;
        this.searchingTanks = false;
      }
    },// eslint-disable-next-line
    async addTankToGarage(tank_id, tank_rank, tank_desc, index) {
      if (typeof tank_rank === 'number' && tank_rank >= 0 && tank_rank <= 10) {
        try {
          await this.$axios.post(this.$apiUrl + "api/mtr/addToGarage", {
            'wg_tank_id': tank_id,
            'ranking': tank_rank,
            'description': tank_desc
          }).then(response => {
            if (response.data.status == 'success') {
              this.tankList.splice(index, 1);
            } else {
              console.log(response.data.message);
            }
          });
        } catch (err) {
          Swal.fire({
            title: "Adding tank",
            text: err.response.data.message,
            icon: "warning",
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.close();
            }
          });
        }
      } else {
        Swal.fire({
          title: "Adding tank",
          text: 'Please rank this tank first.',
          icon: "warning",
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.close();
          }
        });
      }
    }
  }
}
</script>

<style scoped>

</style>