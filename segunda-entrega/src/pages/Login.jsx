import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerUsuarios } from '@api/usuarios.js';
import Button from '@components/Button.jsx';
import Input from '@components/Input.jsx';
import { normalizarCorreo, validarCorreo, validarPassword } from '@/data/cuentas.js';
import '@styles/Cuentas.scss';

/**
 * Valida el usuario contra el mock e inicia la sesión
 * @method Login
 * @param {Object} props - Usuario activo y acción de iniciar sesión
 * @return {JSX.Element} Formulario de acceso o aviso de sesión activa
 */
const Login = ({ usuario, onIngresar }) => {
  const [valores, setValores] = useState({ email: '', password: '' });
  const [tocados, setTocados] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const errores = { email: validarCorreo(valores.email), password: validarPassword(valores.password) };

  /**
   * Actualiza un campo del formulario y lo marca como tocado
   * @method cambiarCampo
   * @param {Object} evento - Cambio del campo controlado
   * @return {void} No retorna un valor
   */
  const cambiarCampo = (evento) => {
    const { name, value } = evento.target;
    setValores({ ...valores, [name]: value });
    setTocados({ ...tocados, [name]: true });
    setError('');
  };

  /**
   * Compara los datos con los usuarios del mock y redirige al inicio
   * @method ingresar
   * @param {Object} evento - Envío del formulario
   * @return {Promise<void>} No retorna un valor
   */
  const ingresar = async (evento) => {
    evento.preventDefault();
    setTocados({ email: true, password: true });
    if (errores.email !== '' || errores.password !== '') return;

    setEnviando(true);
    try {
      const usuarios = await obtenerUsuarios();
      const cuenta = usuarios.find((registrado) =>
        registrado.email === normalizarCorreo(valores.email) && registrado.password === valores.password);
      if (cuenta) {
        onIngresar({ nombre: cuenta.nombre, email: cuenta.email });
        navigate('/');
      } else {
        setValores({ ...valores, password: '' });
        setTocados({ email: true });
        setError('El correo o la contraseña no coinciden. Si no tenés cuenta, creala desde el enlace de abajo.');
      }
    } catch {
      setError('No se pudo verificar el acceso. Verificá que el mock esté en ejecución.');
    }
    setEnviando(false);
  };

  if (usuario) {
    return (
      <section className="cuenta">
        <h2 className="cuenta-titulo">Sesión activa</h2>
        <p className="cuenta-subtitulo">Ingresaste como {usuario.nombre} ({usuario.email}).</p>
        <p className="cuenta-enlace"><Link to="/">Volvé al inicio</Link></p>
      </section>
    );
  }

  return (
    <section className="cuenta">
      <h2 className="cuenta-titulo">Acceso de clientes</h2>
      <p className="cuenta-subtitulo">Ingresá con la cuenta de demostración que creaste.</p>
      <form className="cuenta-formulario" onSubmit={ingresar} noValidate>
        <Input
          id="login-email"
          name="email"
          type="email"
          label="Correo electrónico:"
          placeholder="ejemplo@correo.com"
          size="30"
          maxLength="80"
          autoComplete="username"
          value={valores.email}
          onChange={cambiarCampo}
          error={tocados.email ? errores.email : ''}
        />
        <Input
          id="login-password"
          name="password"
          type="password"
          label="Contraseña:"
          placeholder="Tu contraseña de demostración"
          size="30"
          maxLength="128"
          autoComplete="current-password"
          value={valores.password}
          onChange={cambiarCampo}
          error={tocados.password ? errores.password : ''}
        />
        {error && <p className="cuenta-error" role="alert">{error}</p>}
        <Button type="submit" disabled={enviando}>Iniciá sesión</Button>
      </form>
      <p className="cuenta-enlace">¿Primera vez? <Link to="/registro">Creá una cuenta de demostración</Link>.</p>
      <p className="cuenta-aviso">Demostración académica: no uses datos ni contraseñas reales.</p>
    </section>
  );
};

export default Login;
