import '@styles/Button.scss';

/**
 * Renderiza un botón reutilizable para acciones y formularios
 * @method Button
 * @param {Object} props - Texto, acción, tipo, variante y estado del botón
 * @return {JSX.Element} Botón accesible
 */
const Button = ({ children, onClick, type = 'button', variante = 'principal', disabled = false }) => {
  return (
    <button type={type} className={`boton boton-${variante}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
