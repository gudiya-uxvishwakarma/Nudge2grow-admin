import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const client = axios.create({ baseURL: BASE_URL });

// Attach token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap data from response
const get = (url, params) => client.get(url, { params }).then((r) => r.data);
const post = (url, body) => client.post(url, body).then((r) => r.data);
const put = (url, body) => client.put(url, body).then((r) => r.data);
const patch = (url, body) => client.patch(url, body).then((r) => r.data);
const del = (url) => client.delete(url).then((r) => r.data);

export const api = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  login: (email, password) => post("/auth/login", { email, password }),

  // ── Home ────────────────────────────────────────────────────────────────────
  home: {
    getAll: () => get("/home"),
    create: (body) => post("/home", body),
    update: (id, b) => put(`/home/${id}`, b),
    remove:  (id) => del(`/home/${id}`),
  },

  // ── Intro Slides ────────────────────────────────────────────────────────────
  introSlides: {
    getAll: () => get("/intro-slides"),
    create: (body) => post("/intro-slides", body),
    update: (id, b) => put(`/intro-slides/${id}`, b),
    remove: (id) => del(`/intro-slides/${id}`),
  },

  // ── Personal Setup ──────────────────────────────────────────────────────────
  personalSetup: {
    getAll: () => get("/personal-setup"),
    create: (body)  => post("/personal-setup", body),
    update: (id, b) => put(`/personal-setup/${id}`, b),
    remove: (id) => del(`/personal-setup/${id}`),
  },

  // ── Learning Subjects ───────────────────────────────────────────────────────
  subjects: {
    getAll: () => get("/learning-subjects/subjects"),
    create: (body) => post("/learning-subjects/subjects", body),
    update: (id, b) => put(`/learning-subjects/subjects/${id}`, b),
    remove: (id) => del(`/learning-subjects/subjects/${id}`),
  },

  // ── Milestones ──────────────────────────────────────────────────────────────
  milestones: {
    getAll: () => get("/milestones/milestones"),
    create: (body) => post("/milestones/milestones", body),
    update: (id, b) => put(`/milestones/milestones/${id}`, b),
    remove: (id) => del(`/milestones/milestones/${id}`),
  },
  activities: {
    getAll:() => get("/milestones/activities"),
    create: (body) => post("/milestones/activities", body),
    update: (id, b) => put(`/milestones/activities/${id}`, b),
    remove: (id) => del(`/milestones/activities/${id}`),
  },
  mCategories: {
    getAll:() => get("/milestones/categories"),
    create:  (body) => post("/milestones/categories", body),
    update:  (id, b) => put(`/milestones/categories/${id}`, b),
    remove:  (id)  => del(`/milestones/categories/${id}`),
  },

  // ── Quiz ────────────────────────────────────────────────────────────────────
  quizSubjects: {
    getAll:  ()       => get("/quiz/subjects"),
    create:  (body)   => post("/quiz/subjects", body),
    update:  (id, b)  => put(`/quiz/subjects/${id}`, b),
    remove:  (id)     => del(`/quiz/subjects/${id}`),
  },
  recentQuizzes: {
    getAll:  ()       => get("/quiz/recent"),
    create:  (body)   => post("/quiz/recent", body),
    update:  (id, b)  => put(`/quiz/recent/${id}`, b),
    remove:  (id)     => del(`/quiz/recent/${id}`),
  },
  quizTypes: {
    getAll:  ()       => get("/quiz/types"),
  },

  // ── Learning Summary ────────────────────────────────────────────────────────
  learningSummary: {
    getAll:  (type)   => get("/learning-summary", type ? { type } : {}),
    create:  (body)   => post("/learning-summary", body),
    update:  (id, b)  => put(`/learning-summary/${id}`, b),
    remove:  (id)     => del(`/learning-summary/${id}`),
  },

  // ── Subscription ────────────────────────────────────────────────────────────
  plans: {
    getAll: () => get("/subscription/plans"),
    create: (body) => post("/subscription/plans", body),
    update: (id, b) => put(`/subscription/plans/${id}`, b),
    remove: (id) => del(`/subscription/plans/${id}`),
  },
  testimonials: {
    getAll: () => get("/subscription/testimonials"),
    create: (body) => post("/subscription/testimonials", body),
    update: (id, b) => put(`/subscription/testimonials/${id}`, b),
    remove: (id) => del(`/subscription/testimonials/${id}`),
  },
};
