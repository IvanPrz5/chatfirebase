<template>
  <v-app>
    <v-navigation-drawer width="200" v-model="drawer" :rail="rail" permanent @click="rail = false">
      <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/lists/ali.png"
        :title="appStore.usuario.nombre + ' ' + appStore.usuario.apPaterno" :subtitle="appStore.usuario.email" nav>
        <template v-slot:append>
          <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>
      <v-divider></v-divider>
      <v-list v-for="i in arrayUsers" :key="i" density="compact" nav>
        <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg" :title="i.nombre" value="home"
          :subtitle="i.email" @click="seleccionaChat(i)">
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-list-item prepend-icon="mdi-account-arrow-left" subtitle="Cerrar Sesión" @click="logout()"></v-list-item>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <v-card class="d-flex flex-column fill-height mx-5" :elevation="0">
        <v-card-text id="messages" style="height: 500px;">
          <div v-for="i in mensajes" :key="i" :class="i.from == appStore.usuario.email ? 'd-flex flex-row-reverse flex-column' : 'd-flex'
            ">
            <!-- <v-avatar>
              <v-img v-if="i.from != appStore.usuario.email" src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John"></v-img>
            </v-avatar> -->
            <div class="algo mt-2" :class="i.from == appStore.usuario.email ? 'success' : 'info'">
              {{ i.text }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions v-if="objectUser.id != null" style="border-radius: 5px; margin-top: 15px;">
          <v-text-field v-model="msj" @keyup.enter="enviarMsj()" density="compact" autofocus
            placeholder="Escribe un mensaje"></v-text-field>
        </v-card-actions>
        <!-- <div v-if="objectUser.id != null" style="border-radius: 5px; margin-top: 15px;">
          <v-text-field v-model="msj" @keyup.enter="enviarMsj()" density="compact" autofocus
            placeholder="Escribe un mensaje"></v-text-field>
        </div> -->
      </v-card>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { storeApp } from '@/store/app';
import { database } from "../firebaseconfig";
import * as firestore from "firebase/firestore";

const appStore = storeApp();
let drawer: any = ref(true);
let rail: any = ref(true);
const router = useRouter();
let arrayUsers: any = ref([]);
let mensajes: any = ref([]);
let msj: any = ref();
let objectUser: any = ref({});

onBeforeMount(() => {
  const token = localStorage.getItem("token");
  if (token != null) {
    let user: any = localStorage.getItem("usuario");
    appStore.usuario = JSON.parse(user);
  } else {
    router.push({ path: "/login" });
  }
})

onMounted(() => {
  getUsuarios()
})

async function getUsuarios() {
  try {
    console.log(appStore.usuario.email)
    const collec = firestore.collection(database, "usuarios")
    const q = firestore.query(collec,
      firestore.where("email", "!=", appStore.usuario.email),
      firestore.where("status", "==", true));
    const snapQuery = await firestore.getDocs(q);

    snapQuery.forEach((doc) => {
      arrayUsers.value.push({ ...doc.data(), id: doc.id })
    });
  } catch (error) {
    console.log(error)
  }
}

async function seleccionaChat(item: any) {
  mensajes.value = [];
  objectUser.value = item;

  firestore.onSnapshot(
    firestore.query(
      firestore.collection(database, 'chats/'),
      firestore.or(
        firestore.where("sala", "==", appStore.usuario.email + objectUser.value.email),
        firestore.where("sala", "==", objectUser.value.email + appStore.usuario.email),
      ),
      firestore.orderBy("timestamp", "asc")
    ),
    (snapshot) => {
      mensajes.value = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      }).reverse();
    }
  )
}

async function enviarMsj() {
  const ref = firestore.collection(database, "chats");
  await firestore.addDoc(ref, {
    from: appStore.usuario.email,
    to: objectUser.value.email,
    text: msj.value,
    timestamp: firestore.serverTimestamp(),
    sala: appStore.usuario.email + objectUser.value.email
  })
    .then(() => {
      msj.value = "";
    })
    .catch((e) => {
      console.log(e);
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  appStore.token = "";
  router.push({ path: "/login" });
}
</script>

<style>
#messages {
  display: flex;
  flex-direction: column-reverse;
  height: 100px;
  overflow-y: scroll;
}

.success {
  max-width: 60%;
  padding: 10px;
  background-color: #2196F3;
  color: #fff;
	border-radius: 1.125rem 1.125rem 0 1.125rem;
}

.info {
  max-width: 60%;
  padding: 10px;
  background-color: #b1afb6;
  color: #fff;
	border-radius: 1.125rem 1.125rem 1.125rem 0;
}
</style>
