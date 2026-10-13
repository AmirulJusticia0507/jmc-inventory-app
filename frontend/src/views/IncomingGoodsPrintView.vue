<template>
  <div class="min-h-screen bg-white p-8 print:px-0 print:py-0">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <svg class="animate-spin h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="error" class="text-center text-red-600">
      <p>{{ error }}</p>
      <button @click="goBack" class="mt-4 text-indigo-600 hover:underline">Kembali</button>
    </div>

    <div v-else-if="incomingGood" class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 border-b-2 border-gray-800 pb-4">
        <h1 class="text-2xl font-bold text-gray-900">SURAT BARANG MASUK</h1>
        <p class="text-gray-600">PT JMC Indonesia</p>
      </div>

      <!-- Info Table -->
      <table class="w-full mb-8 border-collapse">
        <tbody>
          <tr>
            <td class="font-medium text-gray-700 w-1/3">Nomor Surat</td>
            <td class="text-gray-900">{{ incomingGood.letterNumber || '-' }}</td>
          </tr>
          <tr>
            <td class="font-medium text-gray-700">Tanggal</td>
            <td class="text-gray-900">{{ formatDate(incomingGood.transactionDate) }}</td>
          </tr>
          <tr>
            <td class="font-medium text-gray-700">Operator</td>
            <td class="text-gray-900">{{ incomingGood.operator?.nama }}</td>
          </tr>
          <tr>
            <td class="font-medium text-gray-700">Kategori</td>
            <td class="text-gray-900">{{ incomingGood.category?.code }} - {{ incomingGood.category?.name }}</td>
          </tr>
          <tr>
            <td class="font-medium text-gray-700">Sub Kategori</td>
            <td class="text-gray-900">{{ incomingGood.subCategory?.name }}</td>
          </tr>
          <tr>
            <td class="font-medium text-gray-700">Asal Barang</td>
            <td class="text-gray-900">{{ incomingGood.source }}</td>
          </tr>
          <tr>
            <td class="font-medium text-gray-700">Status Verifikasi</td>
            <td class="text-gray-900">
              <span :class="incomingGood.isVerified ? 'text-green-600' : 'text-red-600'">
                {{ incomingGood.isVerified ? '✓ Terverifikasi' : '✗ Belum Verifikasi' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Items Table -->
      <table class="w-full border-collapse border border-gray-400 mb-8">
        <thead>
          <tr class="bg-gray-100 border border-gray-400">
            <th class="border border-gray-400 px-3 py-2 text-left text-sm font-medium">No</th>
            <th class="border border-gray-400 px-3 py-2 text-left text-sm font-medium">Kode Item</th>
            <th class="border border-gray-400 px-3 py-2 text-left text-sm font-medium">Nama Item</th>
            <th class="border border-gray-400 px-3 py-2 text-right text-sm font-medium">Harga</th>
            <th class="border border-gray-400 px-3 py-2 text-center text-sm font-medium">Qty</th>
            <th class="border border-gray-400 px-3 py-2 text-center text-sm font-medium">Satuan</th>
            <th class="border border-gray-400 px-3 py-2 text-right text-sm font-medium">Total</th>
            <th class="border border-gray-400 px-3 py-2 text-center text-sm font-medium">Exp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in incomingGood.items" :key="item.id" class="border border-gray-400">
            <td class="border border-gray-400 px-3 py-2 text-center text-sm">{{ index + 1 }}</td>
            <td class="border border-gray-400 px-3 py-2 text-sm">{{ item.itemCode }}</td>
            <td class="border border-gray-400 px-3 py-2 text-sm">{{ item.itemName }}</td>
            <td class="border border-gray-400 px-3 py-2 text-right text-sm">Rp {{ formatNumber(item.price) }}</td>
            <td class="border border-gray-400 px-3 py-2 text-center text-sm">{{ item.quantity }}</td>
            <td class="border border-gray-400 px-3 py-2 text-center text-sm">{{ item.unit }}</td>
            <td class="border border-gray-400 px-3 py-2 text-right text-sm font-medium">Rp {{ formatNumber(item.totalPrice) }}</td>
            <td class="border border-gray-400 px-3 py-2 text-center text-sm">{{ item.expiredDate ? formatDate(item.expiredDate) : '-' }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-50 border border-gray-400">
            <td class="border border-gray-400 px-3 py-2 text-right font-medium" colspan="6">GRAND TOTAL</td>
            <td class="border border-gray-400 px-3 py-2 text-right font-bold text-lg">Rp {{ formatNumber(incomingGood.grandTotal) }}</td>
            <td class="border border-gray-400 px-3 py-2"></td>
          </tr>
        </tfoot>
      </table>

      <!-- Footer Signatures -->
      <div class="grid grid-cols-3 gap-8 mt-12">
        <div class="text-center">
          <p class="text-sm text-gray-600">Dibuat Oleh</p>
          <div class="h-24"></div>
          <p class="border-t border-gray-400 pt-2 text-sm font-medium">{{ incomingGood.operator?.nama }}</p>
          <p class="text-xs text-gray-500">Operator</p>
        </div>
        <div class="text-center">
          <p class="text-sm text-gray-600">Diperiksa Oleh</p>
          <div class="h-24"></div>
          <p class="border-t border-gray-400 pt-2 text-sm font-medium">______________________</p>
          <p class="text-xs text-gray-500">Kepala Gudang</p>
        </div>
        <div class="text-center">
          <p class="text-sm text-gray-600">Disetujui Oleh</p>
          <div class="h-24"></div>
          <p class="border-t border-gray-400 pt-2 text-sm font-medium">______________________</p>
          <p class="text-xs text-gray-500">Manajer</p>
        </div>
      </div>

      <!-- Print Button (hidden on print) -->
      <div class="no-print mt-8 text-center">
        <button @click="printPage" class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
          Cetak / Simpan PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIncomingGoodsStore } from '@/stores/incomingGoods';

const route = useRoute();
const router = useRouter();
const incomingStore = useIncomingGoodsStore();

const incomingGood = ref<any>(null);
const loading = ref(true);
const error = ref('');

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

const printPage = () => {
  window.print();
};

const goBack = () => {
  router.push('/incoming-goods');
};

onMounted(async () => {
  try {
    const data = await incomingStore.fetchOne(route.params.id as string);
    incomingGood.value = data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Gagal memuat data';
  } finally {
    loading.value = false;
  }
});
</script>

<style>
@media print {
  .no-print {
    display: none !important;
  }
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>