const pool = require("../database");

// Busca si el usuario tiene un pedido pendiente (= carrito activo)
async function buscarPedidoPendiente(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM pedidos WHERE user_id = ? AND state = 'Pendiente' LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

// Crea un pedido nuevo en estado Pendiente
async function crearPedido(userId) {
  console.log("Creando pedido para usuario:", userId);
  const [result] = await pool.query(
    `INSERT INTO pedidos (fecha, user_id, state, total) VALUES (NOW(), ?, 'Pendiente', 0)`,
    [userId]
  );
  return { id_pedido: result.insertId };
}

// Agrega un personaje al detalle del pedido
// La tabla detalles tiene UNIQUE(pedido_id, character_id), asi no se duplica
async function agregarDetalle(pedidoId, characterId) {
  await pool.query(
    `INSERT IGNORE INTO detalles (pedido_id, character_id) VALUES (?, ?)`,
    [pedidoId, characterId]
  );
}

// Recalcula el total del pedido sumando los precios de los personajes
async function actualizarTotal(pedidoId) {
  await pool.query(
    `UPDATE pedidos p
     SET total = (
       SELECT COALESCE(SUM(c.price), 0)
       FROM detalles d
       JOIN characters c ON d.character_id = c.id_character
       WHERE d.pedido_id = ?
     )
     WHERE p.id_pedido = ?`,
    [pedidoId, pedidoId]
  );
}

// Función principal: agrega un personaje al carrito
async function agregarAlCarrito(userId, characterId) {
  // 1. Verificar que el personaje existe y es público
  const [chars] = await pool.query(
    `SELECT id_character, name, price FROM characters WHERE id_character = ? AND is_public = 1`,
    [characterId]
  );
  if (chars.length === 0) throw new Error("Personaje no encontrado o no disponible");

  // 2. Verificar que el usuario no sea el creador (no tiene sentido comprarse a sí mismo)
  // const [own] = await pool.query(
  //   `SELECT id_character FROM characters WHERE id_character = ? AND user_id = ?`,
  //   [characterId, userId]
  // );
  // if (own.length > 0) throw new Error("No podés agregar al carrito un personaje que vos creaste");

  // 3. Buscar pedido pendiente o crear uno nuevo
  let pedido = await buscarPedidoPendiente(userId);
  if (!pedido) {
    pedido = await crearPedido(userId);
  }

  // 4. Agregar el personaje al detalle (INSERT IGNORE evita duplicados)
  await agregarDetalle(pedido.id_pedido, characterId);

  // 5. Recalcular el total
  await actualizarTotal(pedido.id_pedido);

  return { message: "Personaje agregado al carrito", pedidoId: pedido.id_pedido };
}

// Ver el carrito actual del usuario
async function verCarrito(userId) {
  const pedido = await buscarPedidoPendiente(userId);
  if (!pedido) return { items: [], total: 0 };

  const [items] = await pool.query(
    `SELECT c.id_character, c.name, c.description, c.avatar_url, c.price, u.username as creator
     FROM detalles d
     JOIN characters c ON d.character_id = c.id_character
     JOIN users u ON c.user_id = u.id_user
     WHERE d.pedido_id = ?`,
    [pedido.id_pedido]
  );

  return { pedidoId: pedido.id_pedido, items, total: pedido.total };
}

// Eliminar un personaje del carrito
async function eliminarDelCarrito(userId, characterId) {
  const pedido = await buscarPedidoPendiente(userId);
  if (!pedido) throw new Error("No tenés un carrito activo");

  await pool.query(
    `DELETE FROM detalles WHERE pedido_id = ? AND character_id = ?`,
    [pedido.id_pedido, characterId]
  );

  await actualizarTotal(pedido.id_pedido);
  return { message: "Personaje eliminado del carrito" };
}

// Confirmar compra: cambia el estado a 'Pago'
async function confirmarCompra(userId) {
  const pedido = await buscarPedidoPendiente(userId);
  if (!pedido) throw new Error("No tenés un carrito activo");

  const [items] = await pool.query(
    `SELECT * FROM detalles WHERE pedido_id = ?`,
    [pedido.id_pedido]
  );
  if (items.length === 0) throw new Error("El carrito está vacío");

  await pool.query(
    `UPDATE pedidos SET state = 'Pago' WHERE id_pedido = ?`,
    [pedido.id_pedido]
  );

  return { message: "Compra confirmada", pedidoId: pedido.id_pedido };
}

// Verificar si el usuario tiene acceso a un personaje (lo compró o es el creador)
async function tieneAcceso(userId, characterId) {
  // Es el creador
  const [creador] = await pool.query(
    `SELECT id_character FROM characters WHERE id_character = ? AND user_id = ?`,
    [characterId, userId]
  );
  if (creador.length > 0) return true;

  // Lo compró (está en un pedido pagado)
  const [compra] = await pool.query(
    `SELECT d.id_detalle FROM detalles d
     JOIN pedidos p ON d.pedido_id = p.id_pedido
     WHERE p.user_id = ? AND d.character_id = ? AND p.state = 'Pago'`,
    [userId, characterId]
  );
  return compra.length > 0;
}

module.exports = {
  agregarAlCarrito,
  verCarrito,
  eliminarDelCarrito,
  confirmarCompra,
  tieneAcceso,
};