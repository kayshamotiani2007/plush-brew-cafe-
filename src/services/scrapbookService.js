import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("plush_brew_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchScrapbookEntries() {
  const response = await api.get("/community");
  return response.data.scrapbookEntries || [];
}

export async function fetchComfortSongs() {
  const response = await api.get("/community");
  return response.data.songs || [];
}

export async function fetchCloudMessages() {
  const response = await api.get("/community");
  return response.data.cloudMessages || [];
}

export async function addPolaroidEntry(formData) {
  const response = await api.post("/community/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function addSongEntry(formData) {
  const response = await api.post("/community/scrapbook", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function addCloudMessage(data) {
  const response = await api.post("/community/cloud-messages", data);
  return response.data;
}

export async function createOrder(orderData) {
  const response = await api.post("/orders", orderData);
  return response.data;
}

export async function createReservation(reservationData) {
  const response = await api.post("/reservations", reservationData);
  return response.data;
}

export async function fetchAdminData() {
  const response = await api.get("/admin/data");
  return response.data;
}

export async function fetchAdminScrapbookItems() {
  const response = await api.get("/community/scrapbook-items");
  return response.data.scrapbookItems || [];
}

export async function deleteAdminScrapbookItem(id) {
  const response = await api.delete(`/admin/scrapbook-items/${id}`);
  return response.data;
}

export async function deletePhotoByUrl(imageUrl) {
  const response = await api.delete(`/admin/photos/by-url`, { data: { imageUrl } });
  return response.data;
}

export async function moderateContent(targetType, id, status) {
  const response = await api.patch(`/admin/${targetType}/${id}`, { status });
  return response.data;
}

export async function updateOrderStatus(orderId, status) {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
}

export async function debugScrapbook() {
  const response = await api.get("/community/debug/scrapbook");
  return response.data;
}