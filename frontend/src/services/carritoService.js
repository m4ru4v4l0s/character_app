const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Ver el carrito actual
export async function getCarrito() {
  const res = await fetch(`${API}/carrito`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Error al obtener el carrito");
  return res.json();
}

// Agregar un personaje al carrito
export async function agregarAlCarrito(characterId) {
  const res = await fetch(`${API}/carrito/${characterId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al agregar al carrito");
  return data;
}

// Eliminar un personaje del carrito
export async function eliminarDelCarrito(characterId) {
  const res = await fetch(`${API}/carrito/${characterId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al eliminar del carrito");
  return data;
}

// Confirmar la compra
export async function confirmarCompra() {
  const res = await fetch(`${API}/carrito/accion/confirmar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al confirmar la compra");
  return data;
}