const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  getAuthToken() {
    return localStorage.getItem('yogalife_token');
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem('yogalife_token', token);
    } else {
      localStorage.removeItem('yogalife_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        // Clear token on 401
        this.setAuthToken(null);
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'An unexpected error occurred');
      }
      return data;
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
      throw err;
    }
  }

  // Auth Endpoints
  async register(data) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  }

  async login(data) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  }

  async googleAuth(data) {
    return this.request('/auth/google', { method: 'POST', body: JSON.stringify(data) });
  }

  async sendPhoneOtp(phoneNumber) {
    return this.request('/auth/phone/send-otp', { method: 'POST', body: JSON.stringify({ phone_number: phoneNumber }) });
  }

  async verifyPhoneOtp(phoneNumber, otpCode, fullName = 'Mindful Yogi') {
    return this.request('/auth/phone/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, otp_code: otpCode, full_name: fullName }),
    });
  }

  async getSessions() {
    return this.request('/auth/sessions');
  }

  // Users
  async getMe() {
    return this.request('/users/me');
  }

  async updateProfile(data) {
    return this.request('/users/me', { method: 'PUT', body: JSON.stringify(data) });
  }

  async submitOnboarding(data) {
    return this.request('/users/onboarding', { method: 'POST', body: JSON.stringify(data) });
  }

  // Yoga & Poses
  async getCategories() {
    return this.request('/yoga/categories');
  }

  async getPoses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/yoga/poses${query ? `?${query}` : ''}`);
  }

  async getPoseById(id) {
    return this.request(`/yoga/poses/${id}`);
  }

  async getPoseBySlug(slug) {
    return this.request(`/yoga/poses/slug/${slug}`);
  }

  async getCustomRoutines() {
    return this.request('/yoga/routines');
  }

  async createCustomRoutine(data) {
    return this.request('/yoga/routines', { method: 'POST', body: JSON.stringify(data) });
  }

  // Practice & Tracking
  async startPractice(data) {
    return this.request('/practice/start', { method: 'POST', body: JSON.stringify(data) });
  }

  async completePractice(data) {
    return this.request('/practice/complete', { method: 'POST', body: JSON.stringify(data) });
  }

  async getPracticeHistory(timeframe = null) {
    return this.request(`/practice/history${timeframe ? `?timeframe=${timeframe}` : ''}`);
  }

  async getStreak() {
    return this.request('/practice/streak');
  }

  // Dashboard
  async getDashboardSummary() {
    return this.request('/dashboard/summary');
  }

  async getPracticeGraph(rangeType = 'week') {
    return this.request(`/dashboard/graph?range_type=${rangeType}`);
  }

  async getWeeklyInsights() {
    return this.request('/dashboard/weekly');
  }

  // Journey
  async getJourneyProgress() {
    return this.request('/journey/progress');
  }

  async checkJourneyStatus() {
    return this.request('/journey/check', { method: 'POST' });
  }

  // Achievements
  async getAchievements() {
    return this.request('/achievements');
  }

  // Awareness
  async getAwarenessArticles(category = null) {
    return this.request(`/awareness${category ? `?category=${category}` : ''}`);
  }

  async getTodayAwareness() {
    return this.request('/awareness/today');
  }

  async completeArticle(articleId) {
    return this.request(`/awareness/${articleId}/complete`, { method: 'POST' });
  }

  // Favorites
  async getFavorites() {
    return this.request('/favorites');
  }

  async addFavorite(data) {
    return this.request('/favorites', { method: 'POST', body: JSON.stringify(data) });
  }

  async removeFavorite(itemType, itemId) {
    return this.request(`/favorites/${itemType}/${itemId}`, { method: 'DELETE' });
  }

  // Journal & Reminders
  async getJournalEntries() {
    return this.request('/journal');
  }

  async createJournalEntry(data) {
    return this.request('/journal', { method: 'POST', body: JSON.stringify(data) });
  }

  async getReminders() {
    return this.request('/journal/reminders');
  }

  async saveReminder(data) {
    return this.request('/journal/reminders', { method: 'POST', body: JSON.stringify(data) });
  }

  // AI Assistant (RAG)
  async queryAssistant(query, history = []) {
    return this.request('/assistant/query', {
      method: 'POST',
      body: JSON.stringify({ query, history }),
    });
  }

  // Body Map
  async getBodyRegions() {
    return this.request('/body-map/regions');
  }

  async getPosesByRegion(region) {
    return this.request(`/body-map/poses/${encodeURIComponent(region)}`);
  }

  // Admin
  async getAdminMetrics() {
    return this.request('/admin/metrics');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async createPose(data) {
    return this.request('/admin/poses', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePose(id, data) {
    return this.request(`/admin/poses/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deletePose(id) {
    return this.request(`/admin/poses/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiService();
