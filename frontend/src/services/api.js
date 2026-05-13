// ============================================================
// e-Qraa API Service — Toutes les requêtes vers le backend
// In dev: Vite proxy forwards /api → http://localhost:5000/api
// In prod: same-origin /api (configure reverse proxy on server)
// ============================================================

const BASE_URL = "/api";

// Helper: récupère le token JWT depuis le localStorage
const getToken = () => localStorage.getItem("eqraa_token");

// Helper: construit les headers avec ou sans auth
const buildHeaders = (withAuth = true, isFormData = false) => {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (withAuth && getToken()) headers["Authorization"] = `Bearer ${getToken()}`;
  return headers;
};

// Helper: gère la réponse et les erreurs HTTP
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || data?.message || `Erreur ${res.status}`;
    throw new Error(message);
  }
  return data;
};

// ─── AUTH ────────────────────────────────────────────────────

export const authAPI = {
  // POST /api/auth/register
  register: async ({ name, email, password, role }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: buildHeaders(false),
      body: JSON.stringify({ name, email, password, role }),
    });
    return handleResponse(res);
  },

  // POST /api/auth/login
  login: async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: buildHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  // POST /api/auth/forgot-password
  forgotPassword: async (email) => {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: buildHeaders(false),
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  // POST /api/auth/reset-password
  resetPassword: async ({ token, password }) => {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: buildHeaders(false),
      body: JSON.stringify({ token, password }),
    });
    return handleResponse(res);
  },
};

// ─── COURSES ─────────────────────────────────────────────────

export const coursesAPI = {
  // GET /api/courses?category=...&minPrice=...&maxPrice=...
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice);

    const res = await fetch(`${BASE_URL}/courses?${params.toString()}`, {
      headers: buildHeaders(false),
    });
    return handleResponse(res);
  },

  // GET /api/courses/:id
  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      headers: buildHeaders(false),
    });
    return handleResponse(res);
  },

  // POST /api/courses (multipart/form-data)
  create: async (formData) => {
    const res = await fetch(`${BASE_URL}/courses`, {
      method: "POST",
      headers: buildHeaders(true, true), // auth required, no Content-Type (browser sets boundary)
      body: formData,
    });
    return handleResponse(res);
  },

  // PUT /api/courses/:id (multipart/form-data)
  update: async (id, formData) => {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: "PUT",
      headers: buildHeaders(true, true),
      body: formData,
    });
    return handleResponse(res);
  },

  // DELETE /api/courses/:id
  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: "DELETE",
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },
};

// ─── ENROLLMENTS ─────────────────────────────────────────────

export const enrollmentsAPI = {
  // POST /api/enrollments  { course_id }
  enroll: async (courseId) => {
    const res = await fetch(`${BASE_URL}/enrollments`, {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify({ course_id: courseId }),
    });
    return handleResponse(res);
  },

  // GET /api/enrollments/my-courses
  getMyCourses: async () => {
    const res = await fetch(`${BASE_URL}/enrollments/my-courses`, {
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },

  // GET /api/enrollments/instructor-stats
  getInstructorStats: async () => {
    const res = await fetch(`${BASE_URL}/enrollments/instructor-stats`, {
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },

  // GET /api/enrollments/admin-stats
  getAdminStats: async () => {
    const res = await fetch(`${BASE_URL}/enrollments/admin-stats`, {
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },

  // GET /api/enrollments/check/:course_id
  checkEnrollment: async (courseId) => {
    const res = await fetch(`${BASE_URL}/enrollments/check/${courseId}`, {
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },
};

// ─── USERS ───────────────────────────────────────────────────

export const usersAPI = {
  // GET /api/users/profile
  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },

  // PUT /api/users/profile  { name, bio, university, specialty }
  updateProfile: async (data) => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: "PUT",
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // POST /api/users/avatar (multipart/form-data)
  uploadAvatar: async (formData) => {
    const res = await fetch(`${BASE_URL}/users/avatar`, {
      method: "POST",
      headers: buildHeaders(true, true),
      body: formData,
    });
    return handleResponse(res);
  },

  // POST /api/users/add-coins  { amount }
  addCoins: async (amount) => {
    const res = await fetch(`${BASE_URL}/users/add-coins`, {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify({ amount }),
    });
    return handleResponse(res);
  },

  // GET /api/users/admin/all
  getAllUsers: async () => {
    const res = await fetch(`${BASE_URL}/users/admin/all`, {
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },

  // GET /api/users/admin/pending-instructors
  getPendingInstructors: async () => {
    const res = await fetch(`${BASE_URL}/users/admin/pending-instructors`, {
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },

  // GET /api/users/instructors
  getInstructors: async () => {
    const res = await fetch(`${BASE_URL}/users/instructors`, {
      headers: buildHeaders(false),
    });
    return handleResponse(res);
  },

  // GET /api/users/leaderboard
  getLeaderboard: async () => {
    const res = await fetch(`${BASE_URL}/users/leaderboard`, {
      headers: buildHeaders(false),
    });
    return handleResponse(res);
  },

  // GET /api/users/admin/all
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/users/admin/all`, {
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },

  // PUT /api/users/admin/verify-instructor/:id
  verifyInstructor: async (instructorId) => {
    const res = await fetch(`${BASE_URL}/users/admin/verify-instructor/${instructorId}`, {
      method: "PUT",
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },
};

// ── PROMOS API ───────────────────────────────────────────────
export const promosAPI = {
  // GET /api/promos (Admin)
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/promos`, {
      headers: buildHeaders(true),
    });
    return handleResponse(res);
  },

  // POST /api/promos (Admin)
  create: async (promoData) => {
    const res = await fetch(`${BASE_URL}/promos`, {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify(promoData),
    });
    return handleResponse(res);
  },

  // POST /api/promos/use (Student)
  use: async (code) => {
    const res = await fetch(`${BASE_URL}/promos/use`, {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify({ code }),
    });
    return handleResponse(res);
  },
};

// ─── HEALTH CHECK ────────────────────────────────────────────

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
};
