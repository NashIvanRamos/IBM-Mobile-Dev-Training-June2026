<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Task Counter</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Task Counter</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Stats Card -->
      <ion-card color="success" class="ion-margin">
        <ion-card-header>
          <ion-card-title>Task Statistics</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-text>
            <p><strong>Total:</strong> {{ totalCount }} | <strong>Done:</strong> {{ doneCount }} | <strong>Pending:</strong> {{ pendingCount }}</p>
          </ion-text>
        </ion-card-content>
      </ion-card>

      <!-- Input Section -->
      <ion-card class="ion-margin">
        <ion-card-content>
          <ion-item lines="none">
            <ion-input
              v-model="newTaskName"
              placeholder="Enter new task..."
              @keyup.enter="handleAddTask"
              clear-input
            ></ion-input>
          </ion-item>
          
          <div class="button-group ion-margin-top">
            <ion-button expand="block" @click="handleAddTask">
              Add Task
            </ion-button>
            <ion-button 
              expand="block" 
              color="warning" 
              @click="store.removeDoneTasks()"
              :disabled="!hasDone"
            >
              Remove Done
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Empty State -->
      <ion-text v-if="tasks.length === 0" color="medium" class="ion-text-center ion-padding">
        <p><em>No tasks yet! Add one above to get started.</em></p>
      </ion-text>

      <!-- Task List -->
      <ion-list v-if="tasks.length > 0" class="ion-margin">
        <ion-item v-for="task in tasks" :key="task.id">
          <ion-checkbox 
            slot="start" 
            :checked="task.done"
            @ionChange="store.toggleTask(task.id)"
          ></ion-checkbox>
          
          <ion-label :class="{ 'task-done': task.done }">
            {{ task.name }}
          </ion-label>
          
          <ion-button 
            slot="end" 
            color="danger" 
            size="small"
            @click="store.removeTask(task.id)"
          >
            Remove
          </ion-button>
        </ion-item>
      </ion-list>

      <!-- Floating Action Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="handleAddTask">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCheckbox,
  IonText,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/vue'
import { add } from 'ionicons/icons'
import { useTaskStore } from '@/stores/taskStore'

// Store setup - Using Pinia for state management
const store = useTaskStore()
const { tasks, totalCount, doneCount, pendingCount, hasDone } = storeToRefs(store)

// Local state for input
const newTaskName = ref('')

// Add task handler
function handleAddTask() {
  if (newTaskName.value.trim()) {
    store.addTask(newTaskName.value)
    newTaskName.value = ''
  }
}
</script>

<style scoped>
.button-group {
  display: flex;
  gap: 8px;
}

.task-done {
  text-decoration: line-through;
  opacity: 0.6;
}

ion-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

ion-list {
  background: transparent;
}

ion-item {
  --background: var(--ion-color-light);
  margin-bottom: 8px;
  border-radius: 8px;
}
</style>