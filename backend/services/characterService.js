const pool = require("../database");

// Obtener todos los personajes publicos y propio del usuario
async function getAll(userId) {
  const [rows] = await pool.query(
    `SELECT c.*, u.username as creator
     FROM characters c
     JOIN users u ON c.user_id = u.id
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
     JOIN users u ON c.user_id = u.id
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
     JOIN users u ON c.user_id = u.id
     WHERE c.id = ? AND (c.is_public = 1 OR c.user_id = ?)`,
    [id, userId]
  );
  return rows[0] || null;
}

async function create(data, userId) {
  const { name, description, personality, avatar_url, is_public } = data;
  if (!name) throw new Error("El nombre es obligatorio");

  const [result] = await pool.query(
    `INSERT INTO characters (name, description, personality, avatar_url, is_public, user_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, personality, avatar_url, is_public ?? 1, userId]
  );
  return { id: result.insertId, ...data, user_id: userId };
}

async function update(id, data, userId) {
  const { name, description, personality, avatar_url, is_public } = data;
  const [result] = await pool.query(
    `UPDATE characters
     SET name=?, description=?, personality=?, avatar_url=?, is_public=?
     WHERE id=? AND user_id=?`,
    [name, description, personality, avatar_url, is_public, id, userId]
  );
  if (result.affectedRows === 0)
    throw new Error("No encontrado o no tenés permiso para editarlo");
  return { id, ...data };
}

async function remove(id, userId) {
  const [result] = await pool.query(
    "DELETE FROM characters WHERE id=? AND user_id=?",
    [id, userId]
  );
  if (result.affectedRows === 0)
    throw new Error("No encontrado o no tenés permiso para eliminarlo");
  return { message: "Personaje eliminado" };
}

module.exports = { getAll, search, getById, create, update, remove };