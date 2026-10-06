const API_BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Fields API
  getFields: () => fetch(`${API_BASE}/fields`).then(handleResponse),
  getFieldById: (id) => fetch(`${API_BASE}/fields/${id}`).then(handleResponse),
  createField: (data) =>
    fetch(`${API_BASE}/fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateField: (id, data) =>
    fetch(`${API_BASE}/fields/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteField: (id) =>
    fetch(`${API_BASE}/fields/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Advisory API
  generateAdvisory: (data) =>
    fetch(`${API_BASE}/advisory/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  getAdvisoryHistory: (fieldId) => fetch(`${API_BASE}/advisory/history/${fieldId}`).then(handleResponse),
  getAdvisoryById: (id) => fetch(`${API_BASE}/advisory/${id}`).then(handleResponse),

  // Diagnostic API
  diagnoseCrop: (formData) =>
    fetch(`${API_BASE}/diagnose`, {
      method: 'POST',
      body: formData,
    }).then(handleResponse),
  getDiagnosticsHistory: () => fetch(`${API_BASE}/diagnose/history`).then(handleResponse),

  // Market & Risks API
  getMarketInsights: () => fetch(`${API_BASE}/market/insights`).then(handleResponse),

  // User & Settings API
  getUserSettings: () => fetch(`${API_BASE}/user`).then(handleResponse),
  updateUserSettings: (data) =>
    fetch(`${API_BASE}/user/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};
