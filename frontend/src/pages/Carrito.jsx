import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  actualizarCantidad,
  confirmarCompra,
  eliminarDelCarrito,
  getCarrito,
} from "../services/carritoService";

export default function Carrito() {
  const [carrito, setCarrito] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
  }, []);

  async function cargarCarrito() {
    try {
      const data = await getCarrito();
      setCarrito(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(characterId) {
    try {
      await eliminarDelCarrito(characterId);
      await cargarCarrito();
      setMensaje("Personaje eliminado del carrito");
      setTimeout(() => setMensaje(""), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSumar(item) {
    try {
      await actualizarCantidad(item.id_character, item.cantidad + 1);
      await cargarCarrito();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRestar(item) {
    if (item.cantidad <= 1) {
      return handleEliminar(item.id_character);
    }
    try {
      await actualizarCantidad(item.id_character, item.cantidad - 1);
      await cargarCarrito();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleConfirmar() {
    try {
      await confirmarCompra();
      setMensaje("¡Compra confirmada! Ya podés chatear con tus personajes 🎉");
      setCarrito({ items: [], total: 0 });
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading)
    return <div className="carrito-loading">Cargando carrito...</div>;

  return (
    <div className="carrito-container">
      <h1 className="carrito-titulo">🛒 Tu Carrito</h1>

      {mensaje && <div className="carrito-mensaje">{mensaje}</div>}
      {error && <div className="carrito-error">{error}</div>}

      {carrito.items.length === 0 ? (
        <div className="carrito-vacio">
          <p>Tu carrito está vacío.</p>
          <button onClick={() => navigate("/")} className="btn-volver">
            Ver personajes
          </button>
        </div>
      ) : (
        <>
          <div className="carrito-items">
            {carrito.items.map((item) => (
              <div key={item.id_character} className="carrito-item">
                <img
                  src={item.avatar_url || "/default-avatar.png"}
                  alt={item.name}
                  className="carrito-avatar"
                />
                <div className="carrito-item-info">
                  <h3>{item.name}</h3>
                  <p className="carrito-creator">por {item.creator}</p>
                  <p className="carrito-desc">{item.description}</p>
                </div>
                <div className="carrito-item-precio">
                  <div className="carrito-cantidad">
                    <button
                      onClick={() => handleRestar(item)}
                      className="btn-cantidad"
                    >
                      −
                    </button>
                    <span className="cantidad-numero">{item.cantidad}</span>
                    <button
                      onClick={() => handleSumar(item)}
                      className="btn-cantidad"
                    >
                      +
                    </button>
                  </div>
                  <span className="carrito-subtotal">
                    ${Number(item.price * item.cantidad).toLocaleString("es-AR")}
                  </span>
                  <button
                    onClick={() => handleEliminar(item.id_character)}
                    className="btn-eliminar"
                    title="Eliminar del carrito"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-footer">
            <div className="carrito-total">
              <span>Total:</span>
              <strong>${Number(carrito.total).toLocaleString("es-AR")}</strong>
            </div>
            <button onClick={handleConfirmar} className="btn-confirmar">
              Confirmar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
