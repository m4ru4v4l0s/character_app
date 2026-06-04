import axios from "axios";

const API = axios.create({
  baseURL: "/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getCharacters = () => API.get("/characters");
export const searchCharacters = (q) => API.get(`/characters/search?q=${q}`);
export const getCharacter = (id) => API.get(`/characters/${id}`);
export const createCharacter = (data) => API.post("/characters", data);
export const updateCharacter = (id, data) => API.put(`/characters/${id}`, data);
export const deleteCharacter = (id) => API.delete(`/characters/${id}`);
export const sendChatMessage = (id, messages) =>
  API.post(`/chat/${id}/message`, { messages });