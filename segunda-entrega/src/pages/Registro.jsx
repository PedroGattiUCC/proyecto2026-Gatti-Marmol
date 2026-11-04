import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { crearUsuario, obtenerUsuarios } from '@api/usuarios.js';
import Button from '@components/Button.jsx';
import Input from '@components/Input.jsx';
import { normalizarCorreo, validarRegistro } from '@/data/cuentas.js';
import '@styles/Cuentas.scss';

/**
 * Crea una cuenta en el mock validando los campos mientras se escriben
 * @method Registro
 * @return {JSX.Element} Formulario de registro
 */
const Registro = () => {
  const [valores, setValores] = useState({ nombre: '', email: '', password: '', confirmacion: '' });
  const [tocados, setTocados] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const errores = validarRegistro(valores);

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
   * Revisa que el correo no exista, crea la cuenta y redirige al acceso
   * @method registrar
   * @param {Object} evento - Envío del formulario
   * @return {Promise<void>} No retorna un valor
   */
  const registrar = async (evento) => {
    evento.preventDefault();
    setTocados({ nombre: true, email: true, password: true, confirmacion: true });
    if (Object.values(errores).some((mensaje) => mensaje !== '')) return;

    setEnviando(true);
    try {
      const email = normalizarCorreo(valores.email);
      const usuarios = await obtenerUsuarios();
      if (usuarios.some((usuario) => usuario.email === email)) {
        setError('Ya existe una cuenta con ese correo. Iniciá sesión o usá otro correo de prueba.');
      } else {
        await crearUsuario({ nombre: valores.nombre.trim(), email, password: valores.password });
        navigate('/login');
      }
    } catch {
      setError('No se pudo crear la cuenta. Verificá que el mock esté en ejecución.');
    }
    setEnviando(false);
  };

  return (
    <section className="cuenta">
      <h2 className="cuenta-titulo">Creá tu cuenta de demostración</h2>
      <p className="cuenta-subtitulo">Completá tus datos de prueba para poder ingresar.</p>
      <form className="cuenta-formulario" onSubmit={registrar} noValidate>
        <Input
          id="registro-nombre"
          name="nombre"
          label="Nombre:"
          placeholder="Ej: Ana Pérez"
          size="30"
          maxLength="60"
          autoComplete="name"
          value={valores.nombre}
          onChange={cambiarCampo}
          error={tocados.nombre ? errores.nombre : ''}
        />
        <Input
          id="registro-email"
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
          id="registro-password"
          name="password"
          type="password"
          label="Contraseña de demostración:"
          placeholder="Mínimo 8 caracteres"
          size="30"
          maxLength="128"
          autoComplete="new-password"
          value={valores.password}
          onChange={cambiarCampo}
          error={tocados.password ? errores.password : ''}
        />
        <Input
          id="registro-confirmacion"
          name="confirmacion"
          type="password"
          label="Repetí la contraseña:"
          placeholder="Repetí tu contraseña de prueba"
          size="30"
          maxLength="128"
          autoComplete="new-password"
          value={valores.confirmacion}
          onChange={cambiarCampo}
          error={tocados.confirmacion ? errores.confirmacion : ''}
        />
        {error && <p className="cuenta-error" role="alert">{error}</p>}
        <Button type="submit" disabled={enviando}>Creá tu cuenta</Button>
      </form>
      <p className="cuenta-enlace">¿Ya creaste una cuenta? <Link to="/login">Iniciá sesión</Link>.</p>
      <p className="cuenta-aviso">Demostración académica: no uses datos ni contraseñas reales.</p>
    </section>
  );
};

export default Registro;
