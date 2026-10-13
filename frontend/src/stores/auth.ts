import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import type { User, LoginResponse } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'Admin');
  const isOperator = computed(() => user.value?.role === 'Operator');

  function setAuth(loginResponse: LoginResponse) {
    token.value = loginResponse.accessToken;
    user.value = loginResponse.user;
    localStorage.setItem('accessToken', loginResponse.accessToken);
    localStorage.setItem('user', JSON.stringify(loginResponse.user));
  }

  function clearAuth() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  function initAuth() {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
    }
  }

  async function login(username: string, password: string) {
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    setAuth(response.data);
    return response.data;
  }

  function logout() {
    clearAuth();
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isOperator,
    login,
    logout,
    initAuth,
    setAuth,
    clearAuth,
  };
});