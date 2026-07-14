<script setup lang="ts">
import { ref } from 'vue';

type FilterValue = 'all' | 'active' | 'completed';

interface FilterOption {
  value: FilterValue;
  label: string;
}

const props = defineProps<{
  currentFilter: FilterValue;
  activeCount: number;
  completedCount: number;
}>();

const emit = defineEmits(['filterChange']);

const filters: FilterOption[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'active', label: 'À faire' },
  { value: 'completed', label: 'Terminées' },
];

const lastFilterChange = ref<string | null>(null);

function selectFilter(filter: FilterValue) {
  lastFilterChange.value = new Date().toLocaleTimeString('fr-FR');
  emit('filterChange', filter);
}
</script>

<template>
  <div class="todo-filter">
    <button
      v-for="f in filters"
      :key="f.value"
      class="btn btn-sm"
      :class="props.currentFilter === f.value ? 'btn-primary' : 'btn-default'"
      @click="selectFilter(f.value)"
    >
      {{ f.label }}
      <span v-if="f.value === 'active'" class="badge">{{
        props.activeCount
      }}</span>
      <span v-if="f.value === 'completed'" class="badge">{{
        props.completedCount
      }}</span>
    </button>

    <small v-if="lastFilterChange" class="todo-filter__last-change">
      (modifié à {{ lastFilterChange }})
    </small>
  </div>
</template>

<style scoped>
.todo-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
}

.todo-filter__last-change {
  align-self: center;
  color: #bbb;
  font-size: 11px;
}
</style>
