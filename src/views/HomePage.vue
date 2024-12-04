<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Restauran Gusteau</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openAddModal">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <InputModal 
        v-model:isOpen="isOpen" 
        v-model:editingId="editingId" 
        :race="race" 
        @submit="handleSubmit" 
      />

      <ion-list>
        <ion-item-sliding v-for="race in races" :key="race.id">
          <ion-item>
            <ion-label>
              <h2>{{ race.nama }}</h2>
              <p>{{ race.langkah }}</p>
            </ion-label>
          </ion-item>

          <ion-item-options side="start">
            <ion-item-option color="danger" @click="handleDelete(race)">
              <ion-icon :icon="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>

          <ion-item-options side="end">
            <ion-item-option @click="handleEdit(race)">
              <ion-icon :icon="create"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonItemSliding, IonItemOption, IonItemOptions, IonLabel } from '@ionic/vue';
import { add, create, trash } from 'ionicons/icons';
import InputModal from '@/components/InputModal.vue';
import { onMounted, ref } from 'vue';
import { firestoreService, type Race } from '@/utils/firestore';

const isOpen = ref(false);
const editingId = ref<string | null>(null);
const race = ref<Omit<Race, 'id' | 'createdAt' | 'updatedAt'>>({ nama: '', langkah: '' });
const races = ref<Race[]>([]);

const loadRaces = async () => {
  races.value = await firestoreService.getRaces();
};

onMounted(() => {
  loadRaces();
});

const handleRefresh = async (event: any) => {
  await loadRaces();
  event.target.complete();
};

const handleSubmit = async (raceData: Omit<Race, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (editingId.value) {
    await firestoreService.updateRace(editingId.value, raceData);
  } else {
    await firestoreService.addRace(raceData);
  }
  loadRaces();
  isOpen.value = false;
};

const handleEdit = (race: Race) => {
  editingId.value = race.id!;
  Object.assign(race, { ...race });
  isOpen.value = true;
};

const handleDelete = async (race: Race) => {
  await firestoreService.deleteRace(race.id!);
  loadRaces();
};

const openAddModal = () => {
  editingId.value = null;
  race.value = { nama: '', langkah: '' }; // Reset form for add
  isOpen.value = true;
};
</script>
