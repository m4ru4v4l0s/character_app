const characterService = require("../services/characterService");

async function getAll(req, res) {
  try {
    const characters = await characterService.getAll(req.usuario.id);
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function search(req, res) {
  try {
    const characters = await characterService.search(
      req.query.q || "",
      req.usuario.id
    );
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const character = await characterService.getById(
      req.params.id,
      req.usuario.id
    );
    if (!character) return res.status(404).json({ error: "No encontrado" });
    res.json(character);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const character = await characterService.create(
      req.body,
      req.usuario.id
    );
    res.status(201).json(character);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const character = await characterService.update(
      req.params.id,
      req.body,
      req.usuario.id
    );
    res.json(character);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const result = await characterService.remove(
      req.params.id,
      req.usuario.id
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { getAll, search, getById, create, update, remove };
