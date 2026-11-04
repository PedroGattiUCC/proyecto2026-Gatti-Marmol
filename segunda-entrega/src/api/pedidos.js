const URL_PEDIDOS = 'http://localhost:4000/pedidos';

/**
 * Registra un pedido de demostración en el mock
 * @method registrarPedido
 * @param {Object} pedido - Piezas, cantidades y total
 * @return {Promise<Object>} Pedido creado con su identificador
 */
export const registrarPedido = async (pedido) => {
  const respuesta = await fetch(URL_PEDIDOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  });
  if (!respuesta.ok) {
    throw new Error('No se pudo registrar el pedido');
  }
  return await respuesta.json();
};
