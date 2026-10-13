<template>
  <MainLayout>
    <template #default>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Master Kategori</h1>
          <button
            @click="openModal(null)"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            Tambah Kategori
          </button>
        </div>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub Kategori
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barang Masuk
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="cat in categories"
                  :key="cat.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    {{ cat.code }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ cat.name }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ cat._count?.incomingGoods || 0 }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ cat.subCategories?.length || 0 }}
                  </td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <button
                      class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      @click="openModal(cat)"
                    >
                      Edit
                    </button>
                    <button
                      class="text-red-600 hover:text-red-900 text-sm font-medium"
                      :disabled="loading"
                      @click="confirmDelete(cat)"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              v-if="categories.length === 0 && !loading"
              class="px-4 py-8 text-center text-gray-500"
            >
              Belum ada kategori. Klik "Tambah Kategori" untuk memulai.
            </div>
          </div>
        </div>

        <!-- Modal -->
        <div
          v-if="modalOpen"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ editingCategory ? 'Edit' : 'Tambah' }} Kategori
            </h3>
        
            <form
              class="space-y-4"
              @submit.prevent="saveCategory"
            >
              <div
                v-if="modalError"
                class="bg-red-50 text-red-600 p-3 rounded-md text-sm"
              >
                {{ modalError }}
              </div>
          
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kode * (max 10 karakter)</label>
                <input
                  v-model="modalForm.code"
                  type="text"
                  required
                  maxlength="10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
              </div>
          
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                <input
                  v-model="modalForm.name"
                  type="text"
                  required
                  maxlength="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
              </div>
          
              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  @click="closeModal"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {{ saving ? 'Menyimpan...' : 'Simpan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="deleteConfirm"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Hapus Kategori?
          </h3>
          <p class="text-gray-600 mb-4">
            Yakin ingin menghapus kategori "{{ deleteConfirm.name }}"?
          </p>
          <div class="flex justify-end space-x-3">
            <button
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              @click="deleteConfirm = null"
            >
              Batal
            </button>
            <button
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              @click="executeDelete"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import MainLayout from '@/components/layout/MainLayout.vue';

const categories = ref<Array<any>>([]);
const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingCategory = ref<any>(null);
const modalForm = ref({ code: '', name: '' });
const modalError = ref('');
const deleteConfirm = ref<{ id: string; name: string } | null>(null);

const fetchCategories = async () => {
  loading.value = true;
  try {
    const response = await api.get('/categories');
    categories.value = response.data;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  } finally {
    loading.value = false;
  }
};

const openModal = (category: any | null) => {
  editingCategory.value = category;
  modalForm.value = category ? { code: category.code, name: category.name } : { code: '', name: '' };
  modalError.value = '';
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  editingCategory.value = null;
  modalForm.value = { code: '', name: '' };
};

const saveCategory = async () => {
  saving.value = true;
  modalError.value = '';
  try {
    if (editingCategory.value) {
      await api.patch(`/categories/${editingCategory.value.id}`, modalForm.value);
    } else {
      await api.post('/categories', modalForm.value);
    }
    closeModal();
    await fetchCategories();
  } catch (err: any) {
    modalError.value = err.response?.data?.message || 'Gagal menyimpan kategori';
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (category: any) => {
  deleteConfirm.value = { id: category.id, name: category.name };
};

const executeDelete = async () => {
  if (!deleteConfirm.value) return;
  try {
    await api.delete(`/categories/${deleteConfirm.value.id}`);
    deleteConfirm.value = null;
    await fetchCategories();
  } catch (err: any) {
    deleteConfirm.value = null;
    alert(err.response?.data?.message || 'Gagal menghapus kategori');
  }
};

onMounted(() => {
  fetchCategories();
});
</script>