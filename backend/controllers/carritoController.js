const carritoService = require("../services/carritoService");

// POST /api/carrito/:characterId
async function agregar(req, res) {
  try {
    const userId = req.usuario.id;
    const characterId = req.params.characterId;
    const cantidad = req.body.cantidad || 1;
    const result = await carritoService.agregarAlCarrito(userId, characterId, cantidad);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// GET /api/carrito
async function ver(req, res) {
  try {
    const userId = req.usuario.id;
    console.log(req.usuario);
    const carrito = await carritoService.verCarrito(userId);
    res.json(carrito);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/carrito/:characterId
async function eliminar(req, res) {
  try {
    const userId = req.usuario.id;
    const characterId = req.params.characterId;
    const result = await carritoService.eliminarDelCarrito(userId, characterId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// POST /api/carrito/confirmar
async function confirmar(req, res) {
  try {
    const userId = req.usuario.id;
    const result = await carritoService.confirmarCompra(userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function actualizarCantidad(req, res) {
  try {
    const userId = req.usuario.id;
    const characterId = req.params.characterId;
    const cantidad = req.body.cantidad;
    const result = await carritoService.actualizarCantidad(
      userId,
      characterId,
      cantidad,
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { agregar, ver, eliminar, confirmar, actualizarCantidad };
