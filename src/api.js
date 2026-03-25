import axios from "axios";

const BASE_URL = "/api";

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
    getAll: () => get("/intro-slides", { admin: "true" }),
    create: (body) => post("/intro-slides", body),
    update: (id, b) => put(`/intro-slides/${id}`, b),
    remove: (id) => del(`/intro-slides/${id}`),
  },

  // ── Child Details ────────────────────────────────────────────────────────────
  childDetails: {
    getAll: ()       => get("/child-details"),
    create: (body)   => post("/child-details", body),
    update: (id, b)  => put(`/child-details/${id}`, b),
    remove: (id)     => del(`/child-details/${id}`),
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

  // ── Users ───────────────────────────────────────────────────────────────────
  users: {
    getAll:      ()       => get("/users"),
    toggleBlock: (id)     => patch(`/users/${id}/toggle-block`, {}),
    remove:      (id)     => del(`/users/${id}`),
  },

  // ── Grades ───────────────────────────────────────────────────────────────────
  grades: {
    getAll: ()       => get("/grade"),
    create: (body)   => post("/grade", body),
    update: (id, b)  => put(`/grade/${id}`, b),
    remove: (id)     => del(`/grade/${id}`),
  },

  // ── Educational Board ────────────────────────────────────────────────────────
  educationalBoards: {
    getAll: ()       => get("/educational-board"),
    create: (body)   => post("/educational-board", body),
    update: (id, b)  => put(`/educational-board/${id}`, b),
    remove: (id)     => del(`/educational-board/${id}`),
  },

  // ── Avatars ──────────────────────────────────────────────────────────────────
  avatars: {
    getAll: ()       => get("/avatars", { admin: "true" }),
    create: (body)   => post("/avatars", body),
    update: (id, b)  => put(`/avatars/${id}`, b),
    remove: (id)     => del(`/avatars/${id}`),
  },

  // ── Customize Learning ───────────────────────────────────────────────────────
  customizeLearning: {
    getAll: ()       => get("/customize-learning"),
    create: (body)   => post("/customize-learning", body),
    update: (id, b)  => put(`/customize-learning/${id}`, b),
    remove: (id)     => del(`/customize-learning/${id}`),
  },

  // ── Did You Know ─────────────────────────────────────────────────────────────
  didYouKnow: {
    getAll: ()       => get("/did-you-know"),
    create: (body)   => post("/did-you-know", body),
    update: (id, b)  => put(`/did-you-know/${id}`, b),
    remove: (id)     => del(`/did-you-know/${id}`),
  },

  // ── Today's Riddle ───────────────────────────────────────────────────────────
  riddles: {
    getAll: ()       => get("/riddles"),
    create: (body)   => post("/riddles", body),
    update: (id, b)  => put(`/riddles/${id}`, b),
    remove: (id)     => del(`/riddles/${id}`),
  },

  // ── Parenting Insights ───────────────────────────────────────────────────────
  parentingInsights: {
    getAll: ()       => get("/parenting-insights"),
    create: (body)   => post("/parenting-insights", body),
    update: (id, b)  => put(`/parenting-insights/${id}`, b),
    remove: (id)     => del(`/parenting-insights/${id}`),
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

  // ── FAQs ─────────────────────────────────────────────────────────────────────
  faqs: {
    getAll: () => get("/subscription/faqs"),
    create: (body) => post("/subscription/faqs", body),
    update: (id, b) => put(`/subscription/faqs/${id}`, b),
    remove: (id) => del(`/subscription/faqs/${id}`),
  },

  // ── Faith Background ─────────────────────────────────────────────────────────
  faithBackground: {
    getAll: ()       => get("/faith-background"),
    create: (body)   => post("/faith-background", body),
    update: (id, b)  => put(`/faith-background/${id}`, b),
    remove: (id)     => del(`/faith-background/${id}`),
  },
};
