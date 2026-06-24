const pool = require("../database");

// Obtener todos los personajes publicos y propio del usuario
async function getAll(userId) {
  const [rows] = await pool.query(
    `SELECT c.*, u.username as creator
     FROM characters c
     JOIN users u ON c.user_id = u.id_user
     WHERE c.is_public = 1 OR c.user_id = ?
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return rows;
}

// Buscar personajes por nombre
async function search(query, userId) {
  const [rows] = await pool.query(
    `SELECT c.*, u.username as creator
     FROM characters c
     JOIN users u ON c.user_id = u.id_user
     WHERE (c.is_public = 1 OR c.user_id = ?)
       AND c.name LIKE ?
     ORDER BY c.created_at DESC`,
    [userId, `%${query}%`]
  );
  return rows;
}

async function getById(id, userId) {
  const [rows] = await pool.query(
    `SELECT c.*, u.username as creator
     FROM characters c
     JOIN users u ON c.user_id = u.id_user
     WHERE c.id_character = ? AND (c.is_public = 1 OR c.user_id = ?)`,
    [id, userId]
  );
  return rows[0] || null;
}

async function create(data, userId) {
  const { name, description, personality, avatar_url, is_public, price } = data;
  if (!name) throw new Error("El nombre es obligatorio");

  const [result] = await pool.query(
    `INSERT INTO characters (name, description, personality, avatar_url, is_public, user_id, created_at, price)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)`,
    [name, description, personality, avatar_url, is_public ?? 1, userId, price ?? 1000]
  );
  return { id: result.insertId, ...data, user_id: userId };
}

async function update(id, data, userId) {
  const { name, description, personality, avatar_url, is_public, price } = data;
  const [result] = await pool.query(
    `UPDATE characters
     SET name=?, description=?, personality=?, avatar_url=?, is_public=?, price=?
     WHERE id_character=? AND user_id=?`,
    [name, description, personality, avatar_url, is_public, price, id, userId]
  );
  if (result.affectedRows === 0)
    throw new Error("No encontrado o no tenés permiso para editarlo");
  return { id, ...data };
}

async function remove(id, userId) {
  const [result] = await pool.query(
    "DELETE FROM characters WHERE id_character=? AND user_id=?",
    [id, userId]
  );
  if (result.affectedRows === 0)
    throw new Error("No encontrado o no tenés permiso para eliminarlo");
  return { message: "Personaje eliminado" };
}

module.exports = { getAll, search, getById, create, update, remove };