<template>
  <MainLayout>
    <template #default>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Sub Kategori</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Batas Harga</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang Masuk</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="sub in subCategories" :key="sub.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ sub.category?.code }} - {{ sub.category?.name }}</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ sub.name }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 text-right">Rp {{ formatNumber(sub.priceLimit) }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ sub._count?.incomingGoods || 0 }}</td>
                <td class="px-4 py-3 text-center space-x-2">
                  <button
                    @click="openModal(sub)"
                    class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(sub)"
                    class="text-red-600 hover:text-red-900 text-sm font-medium"
                    :disabled="loading"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="subCategories.length === 0 && !loading" class="px-4 py-8 text-center text-gray-500">
            Belum ada sub kategori. Klik "Tambah Sub Kategori" untuk memulai.
          </div>
        </div>
      </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ editingSubCategory ? 'Edit' : 'Tambah' }} Sub Kategori</h3>
        
        <form @submit.prevent="saveSubCategory" class="space-y-4">
          <div v-if="modalError" class="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {{ modalError }}
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
            <select
              v-model="modalForm.categoryId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Pilih Kategori</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.code }} - {{ cat.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Sub Kategori *</label>
            <input
              v-model="modalForm.name"
              type="text"
              required
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Batas Harga * (Rupiah)</label>
            <input
              v-model.number="modalForm.priceLimit"
              type="number"
              required
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p class="mt-1 text-xs text-gray-500">Format: 5000000 (akan ditampilkan sebagai Rp 5.000.000)</p>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
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
    <div v-if="deleteConfirm" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Hapus Sub Kategori?</h3>
        <p class="text-gray-600 mb-4">Yakin ingin menghapus sub kategori "{{ deleteConfirm.name }}"?</p>
        <div class="flex justify-end space-x-3">
          <button @click="deleteConfirm = null" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Batal
          </button>
          <button @click="executeDelete" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
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

const subCategories = ref<Array<any>>([]);
const categories = ref<Array<any>>([]);
const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const editingSubCategory = ref<any>(null);
const modalForm = ref({ categoryId: '', name: '', priceLimit: 0 });
const modalError = ref('');
const deleteConfirm = ref<{ id: string; name: string } | null>(null);

const fetchData = async () => {
  loading.value = true;
  try {
    const [subCats, cats] = await Promise.all([
      api.get('/sub-categories'),
      api.get('/categories'),
    ]);
    subCategories.value = subCats.data;
    categories.value = cats.data;
  } catch (err) {
    console.error('Failed to fetch data:', err);
  } finally {
    loading.value = false;
  }
};

const openModal = (subCategory: any | null) => {
  editingSubCategory.value = subCategory;
  modalForm.value = subCategory
    ? { categoryId: subCategory.categoryId, name: subCategory.name, priceLimit: Number(subCategory.priceLimit) }
    : { categoryId: '', name: '', priceLimit: 0 };
  modalError.value = '';
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  editingSubCategory.value = null;
  modalForm.value = { categoryId: '', name: '', priceLimit: 0 };
};

const saveSubCategory = async () => {
  saving.value = true;
  modalError.value = '';
  try {
    if (editingSubCategory.value) {
      await api.patch(`/sub-categories/${editingSubCategory.value.id}`, modalForm.value);
    } else {
      await api.post('/sub-categories', modalForm.value);
    }
    closeModal();
    await fetchData();
  } catch (err: any) {
    modalError.value = err.response?.data?.message || 'Gagal menyimpan sub kategori';
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (subCategory: any) => {
  deleteConfirm.value = { id: subCategory.id, name: subCategory.name };
};

const executeDelete = async () => {
  if (!deleteConfirm.value) return;
  try {
    await api.delete(`/sub-categories/${deleteConfirm.value.id}`);
    deleteConfirm.value = null;
    await fetchData();
  } catch (err: any) {
    deleteConfirm.value = null;
    alert(err.response?.data?.message || 'Gagal menghapus sub kategori');
  }
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

onMounted(() => {
  fetchData();
});
</script>