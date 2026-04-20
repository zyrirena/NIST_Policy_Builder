// Use relative URLs in production (same origin), absolute in dev
const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? ''  // Production: same origin, relative paths
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return window.localStorage?.getItem('token');
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem('token', token);
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      window.localStorage?.removeItem('token');
      window.localStorage?.removeItem('user');
    }
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const u = window.localStorage?.getItem('user');
      return u ? JSON.parse(u) : null;
    }
    return null;
  }

  setUser(user) {
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem('user', JSON.stringify(user));
    }
  }

  async request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });
    
    if (res.status === 401 || res.status === 403) {
      this.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Request failed: ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/pdf')) {
      return res.blob();
    }

    return res.json();
  }

  get(path) { return this.request(path); }
  
  post(path, body) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) });
  }
  
  put(path, body) {
    return this.request(path, { method: 'PUT', body: JSON.stringify(body) });
  }
  
  delete(path) {
    return this.request(path, { method: 'DELETE' });
  }

  async uploadFile(path, formData) {
    const url = `${this.baseUrl}${path}`;
    const token = this.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { method: 'POST', headers, body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Upload failed');
    }
    return res.json();
  }

  async downloadPDF(systemId) {
    const url = `${this.baseUrl}/api/policies/pdf/${systemId}`;
    const token = this.getToken();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('PDF generation failed');
    return res.blob();
  }

  // Auth
  login(email, password) { return this.post('/api/auth/login', { email, password }); }
  register(data) { return this.post('/api/auth/register', data); }
  getMe() { return this.get('/api/auth/me'); }

  // Organizations
  getMyOrg() { return this.get('/api/organizations/mine'); }
  createOrg(data) { return this.post('/api/organizations', data); }
  updateOrg(id, data) { return this.put(`/api/organizations/${id}`, data); }

  // AI Systems
  getSystems() { return this.get('/api/ai-systems'); }
  getSystem(id) { return this.get(`/api/ai-systems/${id}`); }
  createSystem(data) { return this.post('/api/ai-systems', data); }
  updateSystem(id, data) { return this.put(`/api/ai-systems/${id}`, data); }
  deleteSystem(id) { return this.delete(`/api/ai-systems/${id}`); }

  // Policies
  generatePolicies(systemId) { return this.post(`/api/policies/generate/${systemId}`); }
  getPolicies(systemId) { return this.get(`/api/policies/${systemId}`); }

  // Gap Analysis
  getGapAnalysis(systemId) { return this.get(`/api/gap-analysis/${systemId}`); }
  submitGapAnalysis(systemId, answers) { return this.post(`/api/gap-analysis/${systemId}`, { answers }); }

  // Dashboard
  getDashboard() { return this.get('/api/dashboard'); }

  // Alerts
  getAlerts() { return this.get('/api/alerts'); }
  markAlertRead(id) { return this.put(`/api/alerts/${id}/read`); }

  // Tasks
  getTasks() { return this.get('/api/tasks'); }
  createTask(data) { return this.post('/api/tasks', data); }
  updateTask(id, data) { return this.put(`/api/tasks/${id}`, data); }

  // Documents
  getDocuments() { return this.get('/api/documents'); }

  // Monitoring
  getMonitoring(systemId) { return this.get(`/api/monitoring/${systemId}`); }

  // Activity
  getActivity() { return this.get('/api/activity'); }

  // Maturity
  getMaturity(systemId) { return this.get(`/api/maturity/${systemId}`); }

  // AI Advisor
  getAdvisorStatus() { return this.get('/api/advisor/status'); }
  askAdvisor(message, systemId) { return this.post('/api/advisor/ask', { message, systemId }); }
  reviewPolicy(policyContent, systemId) { return this.post('/api/advisor/review-policy', { policyContent, systemId }); }
  getRemediation(systemId) { return this.post('/api/advisor/remediation', { systemId }); }
}

const api = new ApiClient();
export default api;
