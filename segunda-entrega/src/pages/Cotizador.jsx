import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/Button.jsx';
import Input from '@components/Input.jsx';
import { metales, tarifas } from '@data/cotizacion.json';
import { calcularCotizacion } from '@utils/cotizacion.js';
import { validarCotizacion } from '@utils/validaciones.js';
import '@styles/Cotizador.scss';

const VALORES_INICIALES = { metal: 'oro18k', peso: '', gemas: '0', grabado: '' };

/**
 * Calcula el presupuesto validando los campos mientras se escriben
 * @method Cotizador
 * @param {Object} props - Acción de agregar al carrito y bloqueo durante el pedido
 * @return {JSX.Element} Formulario y presupuesto de la pieza personalizada
 */
const Cotizador = ({ onAgregar, bloqueado }) => {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [tocados, setTocados] = useState({});
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const errores = validarCotizacion(valores);

  /**
   * Actualiza un campo y descarta el presupuesto anterior para evitar precios desactualizados
   * @method cambiarCampo
   * @param {Object} evento - Cambio del campo controlado
   * @return {void} No retorna un valor
   */
  const cambiarCampo = (evento) => {
    const { name, value } = evento.target;
    setValores({ ...valores, [name]: value });
    setTocados({ ...tocados, [name]: true });
    setResultado(null);
    setMensaje('');
  };

  /**
   * Muestra los errores o calcula una cotización válida
   * @method calcular
   * @param {Object} evento - Envío del formulario
   * @return {void} No retorna un valor
   */
  const calcular = (evento) => {
    evento.preventDefault();
    setTocados({ peso: true, gemas: true, grabado: true });
    setMensaje('');
    if (Object.values(errores).some((error) => error !== '')) {
      setResultado(null);
      return;
    }
    setResultado(calcularCotizacion(valores));
  };

  /**
   * Limpia el formulario, los errores y el resultado
   * @method restablecer
   * @return {void} No retorna un valor
   */
  const restablecer = () => {
    setValores(VALORES_INICIALES);
    setTocados({});
    setResultado(null);
    setMensaje('');
  };

  /**
   * Agrega una pieza cuya identidad conserva toda la configuración cotizada
   * @method agregarCotizacion
   * @return {void} No retorna un valor
   */
  const agregarCotizacion = () => {
    if (!resultado) return;
    const configuracion = [valores.metal, Number(valores.peso), Number(valores.gemas), valores.grabado.trim()];
    const agregado = onAgregar({
      id: `personalizada-${encodeURIComponent(JSON.stringify(configuracion))}`,
      nombre: `Joya a medida (${metales[valores.metal].nombre}, ${valores.peso} g, ${valores.gemas} gemas${valores.grabado.trim() ? `, grabado: ${valores.grabado.trim()}` : ', sin grabado'})`,
      precio: resultado.total,
    });
    setMensaje(agregado ? 'Joya personalizada agregada al carrito.' : 'No se pudo agregar la pieza. Revisá el aviso del carrito.');
  };

  return (
    <section className="cotizador">
      <h2>Cotizador interactivo de joyas</h2>
      <p>Configurá tu pieza para obtener un presupuesto estimativo con las tarifas del taller.</p>
      <form className="cotizador-formulario" onSubmit={calcular} noValidate>
        <div className="campo">
          <label htmlFor="tipo-metal">Elegí el metal precioso:</label>
          <select id="tipo-metal" name="metal" value={valores.metal} onChange={cambiarCampo}>
            {Object.entries(metales).map(([clave, metal]) => (
              <option key={clave} value={clave}>{metal.nombre} ($ {metal.precio.toLocaleString('es-AR')}/g)</option>
            ))}
          </select>
        </div>
        <Input id="peso-joya" name="peso" label="Peso aproximado en gramos (1 - 500 g):" type="number" min="1" max="500" step="any" required value={valores.peso} onChange={cambiarCampo} error={tocados.peso ? errores.peso : ''} />
        <Input id="cantidad-gemas" name="gemas" label={`Cantidad de gemas a engarzar ($ ${tarifas.gema.toLocaleString('es-AR')} por gema):`} type="number" min="0" max="30" step="1" required value={valores.gemas} onChange={cambiarCampo} error={tocados.gemas ? errores.gemas : ''} />
        <Input id="texto-grabado" name="grabado" label={`Grabado opcional (hasta 25 caracteres, $ ${tarifas.grabado.toLocaleString('es-AR')}):`} maxLength={25} value={valores.grabado} onChange={cambiarCampo} error={tocados.grabado ? errores.grabado : ''} />
        <div className="cotizador-acciones">
          <Button type="submit">Calculá tu presupuesto</Button>
          <Button variante="secundario" onClick={restablecer}>Restablecé</Button>
        </div>
      </form>
      {resultado && (
        <div className="cotizador-resultado" aria-live="polite">
          <h3>Presupuesto estimativo</h3>
          <p>{valores.peso} g de {metales[valores.metal].nombre}: $ {resultado.importeMetal.toLocaleString('es-AR')} ARS</p>
          <p>{valores.gemas} gemas engarzadas: $ {resultado.importeGemas.toLocaleString('es-AR')} ARS</p>
          <p>{valores.grabado.trim() ? `Grabado: ${valores.grabado.trim()}` : 'Sin grabado personalizado'}: $ {resultado.importeGrabado.toLocaleString('es-AR')} ARS</p>
          <p className="cotizador-total">Total estimado: $ {resultado.total.toLocaleString('es-AR')} ARS</p>
          <p>El valor definitivo se confirmará en el taller según la cotización vigente y los detalles del diseño.</p>
          <Button onClick={agregarCotizacion} disabled={bloqueado}>Agregá tu joya personalizada al carrito</Button>
        </div>
      )}
      <p role="status">{mensaje}</p>
      <Link to="/carrito">Revisá tu carrito</Link>
    </section>
  );
};

export default Cotizador;
