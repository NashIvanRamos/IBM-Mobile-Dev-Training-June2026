// =============================================================
//  Task Store for Ionic TaskFlow App
//  Centralized State Management with Pinia
// =============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const nextId = ref(1)

  // Getters (computed properties)
  const totalCount = computed(() => tasks.value.length)
  const doneCount = computed(() => tasks.value.filter(t => t.done).length)
  const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)
  const hasDone = computed(() => tasks.value.some(t => t.done))

  // Actions
  function addTask(name) {
    if (!name || !name.trim()) return
    tasks.value.push({ 
      id: nextId.value++, 
      name: name.trim(), 
      done: false 
    })
  }

  function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) task.done = !task.done
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  function removeDoneTasks() {
    tasks.value = tasks.value.filter(t => !t.done)
  }

  // Return everything the component needs to access
  return { 
    tasks, 
    totalCount, 
    doneCount, 
    pendingCount, 
    hasDone,
    addTask, 
    toggleTask, 
    removeTask,
    removeDoneTasks
  }
})
