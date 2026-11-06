import axios from "axios";

// Adjust this if your Spring Boot app runs on a different host/port
const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic CRUD factory — every module follows the same POST / GET / PUT{id} shape
function crud(resource) {
  return {
    getAll: () => api.get(`/${resource}`).then((res) => res.data),
    create: (data) => api.post(`/${resource}`, data).then((res) => res.data),
    update: (id, data) =>
      api.put(`/${resource}/${id}`, data).then((res) => res.data),
  };
}

export const categoryApi = crud("categories");
export const supplierApi = crud("suppliers");
export const productApi = crud("products");
export const userApi = crud("users");
export const inventoryApi = crud("inventory");
export const purchaseOrderApi = {
  ...crud("purchase-orders"),
   receive: (id) =>
  api.put(`/purchase-orders/${id}/receive`, {
    user_id: 2
  }).then((res) => res.data),};
export const purchaseOrderItemApi = crud("purchase-order-items");
export const saleApi = crud("sales");
export const saleItemApi = crud("sale-items");
export const stockTransactionApi = crud("stock-transactions");
export const notificationApi = {
  ...crud("notifications"),

  markAsRead: (id) =>
    api.put(`/notifications/${id}/read`)
       .then((res) => res.data),
};

export default api;

export const analyticsApi = {
  getTotalRevenue: () =>
    api.get("/analytics/total-revenue").then((res) => res.data),

  getBestSellingProducts: () =>
    api.get("/analytics/best-selling-products").then((res) => res.data),

  getDailySales: () =>
    api.get("/analytics/daily-sales").then((res) => res.data),

  getProductDailySales: (productId) =>
    api.get(`/analytics/daily-sales/${productId}`).then((res) => res.data),

  getForecast: (productId, days = 7) =>
    api.get(`/forecast/${productId}?days=${days}`).then((res) => res.data),

  getRestockSuggestion: (productId, forecastDays = 7, planningDays = 7) =>
    api.get(
      `/restock/${productId}?forecastDays=${forecastDays}&planningDays=${planningDays}`
    ).then((res) => res.data),
};
