<template>
  <div class="ailityInfo" v-if="showEffect">
    <button class="closeButton" @click="closeAbilityInfo">X</button>
    <div class="abilityTitle">Effect from {{ selectedAbility }} attack:</div>
    <div class="abilityText">{{ effectOfAbility }}</div>
  </div>
  <main class="wrapper">
    <h1 class="title">PokéSearch</h1>
    <div class="pokemonForm">
      <el-select-v2
        class="selectElement"
        v-model="selectedPokemon"
        :options="pokeArr"
        placeholder="Select pokemon"
        style="width: 280px; vertical-align: middle"
        allow-create
        filterable
        clearable
        @clear="dataReload"
      />
      <el-button
        type="info"
        class="searchBtn"
        @click="getPokemonInfo(selectedPokemon)"
        >Search</el-button
      >
    </div>

    <div class="imgSearchResult" v-if="showData">
      <img
        :src="currentUrl"
        :alt="imgAltName"
        class="avatarImage"
        @click="nextUrl"
      />
      <div
        v-for="(data, index) in abilitiesArr"
        :key="index"
        class="abilitiesBox"
      >
        <div class="ability" @click="abilityInfo(data)">{{ data.ability }}</div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { onMounted, reactive, ref } from "vue";

export default {
  name: "PokemonSearch",
  setup() {
    let pokeObj = reactive({});
    let pokeArr = reactive([]);

    const getPokemons = () => {
      axios
        .get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=2000`)
        .then((response) => {
          for (let i = 0; i < response.data.results.length; i++) {
            pokeObj = {
              value: response.data.results[i].name,
              label:
                response.data.results[i].name.charAt(0).toUpperCase() +
                response.data.results[i].name.slice(1),
            };
            pokeArr.push(pokeObj);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    let imgURL = ref("");
    let imgURLs = reactive([]);
    let imgAltName = ref("");
    let currentUrl = ref(0);
    let showData = ref(false);
    let selectedPokemon = ref("");
    let abilitiesArr = reactive([]);

    const getPokemonInfo = async (selectedPokemon) => {
      abilitiesArr.length = 0;
      imgURLs.length = 0;
      if (selectedPokemon === "") {
        return;
      }
      await axios
        .get(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}/`)
        .then((response) => {
          console.log(response);
          for (let key in response.data.sprites) {
            if (
              response.data.sprites[key] &&
              key !== "other" &&
              key !== "versions"
            ) {
              imgURLs.push(response.data.sprites[key]);
            }
          }

          imgURL.value = response.data.sprites.front_default;
          imgAltName.value =
            response.data.name.charAt(0).toUpperCase() +
            response.data.name.slice(1);
          for (let i = 0; i < response.data.abilities.length; i++) {
            if (abilitiesArr.length !== response.data.abilities.length) {
              abilitiesArr.push({
                ability: response.data.abilities[i].ability.name.toUpperCase(),
                abilityUrl: response.data.abilities[i].ability.url,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      showData.value = true;
      if (imgURLs.length > 2) {
        currentUrl.value = imgURLs[2];
        arrayMove();
      } else {
        currentUrl.value = imgURLs[0];
      }
    };

    const arrayMove = function () {
      let element = imgURLs[2];
      imgURLs.splice(2, 1);
      imgURLs.splice(0, 0, element);
      console.log(imgURLs);
    };

    const nextUrl = () => {
      let currentIndex = imgURLs.findIndex((url) => url === currentUrl.value);
      currentIndex = currentIndex + 1;
      if (imgURLs.length <= currentIndex) {
        currentIndex = 0;
      }
      currentUrl.value = imgURLs[currentIndex];
    };

    let effectOfAbility = ref("");
    let selectedAbility = ref("");
    let showEffect = ref(false);

    const abilityInfo = (data) => {
      selectedAbility.value = data.ability;
      showEffect.value = true;
      axios
        .get(`${data.abilityUrl}`)
        .then((response) => {
          effectOfAbility.value = response.data.effect_entries[1].effect;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const closeAbilityInfo = () => {
      showEffect.value = false;
    };

    const dataReload = () => {
      showData.value = false;
      showEffect.value = false;
      imgURLs.length = 0;
    };

    onMounted(() => {
      getPokemons();
    });

    return {
      pokeArr,
      selectedPokemon,
      getPokemonInfo,
      imgURL,
      imgAltName,
      dataReload,
      showData,
      abilitiesArr,
      abilityInfo,
      effectOfAbility,
      selectedAbility,
      showEffect,
      closeAbilityInfo,
      currentUrl,
      nextUrl,
    };
  },
};
</script>

<style>
.title {
  margin: 48px 0;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}
.pokemonForm {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.input {
  border-bottom: 1px solid black;
}
.selectElement {
  margin-right: 20px;
}
.imgSearchResult {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 35px;
}
.avatarImage {
  width: 280px;
  border: 1px solid #909399;
  border-radius: 50%;
  margin-bottom: 30px;
  cursor: pointer;
}
.abilitiesBox {
  font-size: 0.7rem;
  color: #909399;
}
.ability {
  margin-bottom: 10px;
  padding: 5px;
  border-bottom: 1px solid #909399;
  border-radius: 20px;
  width: 350px;
  text-align: center;
  cursor: pointer;
}
.ability:hover {
  background-color: #f5f7fa;
  color: #409eff;
}
.ailityInfo {
  position: absolute;
  margin-left: 1000px;
  margin-top: 480px;
  font-size: 0.7rem;
  border: 1px solid #409eff;
  border-radius: 8px;
  padding: 6px;
  margin-right: 80px;
}
.abilityTitle {
  font-size: 0.6rem;
  color: #7a7a7a;
  margin-bottom: 5px;
}
.abilityText {
  font-size: 0.55rem;
  color: #909399;
}
.closeButton {
  font-size: 0.55rem;
  border: 1px solid #909399;
  border-radius: 50%;
  position: absolute;
  margin-left: 430px;
  cursor: pointer;
  width: 12px;
  text-align: center;
  color: #7a7a7a;
  font-size: 0.4rem;
}
</style>
