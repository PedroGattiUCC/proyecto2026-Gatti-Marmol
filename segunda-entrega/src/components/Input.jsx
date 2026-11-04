import '@styles/Input.scss';

/**
 * Vincula un campo controlado con su etiqueta y su mensaje de error
 * @method Input
 * @param {Object} props - Identificador, etiqueta, valor, evento y restricciones
 * @return {JSX.Element} Campo con error accesible
 */
const Input = ({ id, label, value, onChange, error = '', type = 'text', ...atributos }) => {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <input
        {...atributos}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <p className="campo-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
};

export default Input;
