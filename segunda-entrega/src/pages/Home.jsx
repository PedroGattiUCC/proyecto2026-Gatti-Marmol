import { Link } from 'react-router-dom';
import imagenHero from '@assets/imagenes/joyas_hero.jpg';
import '@styles/Home.scss';

/**
 * Muestra la página de inicio
 * @method Home
 * @return {JSX.Element} Contenido de la página
 */
const Home = () => {
  return (
    <>
      <section className="home-banner">
        <div className="home-banner-texto">
          <h2>Piezas eternas forjadas a mano</h2>
          <p>
            En Laure Joyas fusionamos el arte orfebre tradicional con gemas de pureza inigualable. Cada joya cuenta una historia única, diseñada para trascender generaciones con la máxima distinción.
          </p>
          <div className="home-acciones">
            <Link to="/catalogo" className="home-accion-principal">
              Explorá el catálogo
            </Link>
            <Link to="/cotizador" className="home-accion-secundaria">
              Cotizá a medida
            </Link>
          </div>
        </div>
        <img
          className="home-banner-imagen"
          src={imagenHero}
          alt="Colección de anillos y colgantes con diamantes engarzados sobre terciopelo"
        />
      </section>

      <section className="home-seccion">
        <h2>Obras maestras destacadas</h2>
        <p className="home-subtitulo">
          Selección curada de nuestras piezas más representativas en oro blanco, platino puro y piedras preciosas.
        </p>

        <div className="home-tarjetas">
          <article className="home-tarjeta">
            <img src="/imagenes/joyas_hero.jpg" alt="Anillo Solitario Imperial en oro amarillo 18k con diamante central" />
            <div className="home-tarjeta-cuerpo">
              <span className="home-tarjeta-metal">Oro amarillo 18k</span>
              <h3>Solitario Imperial</h3>
              <p>Anillo solitario clásico con diamante engarzado en oro amarillo de 18 quilates.</p>
              <p className="home-tarjeta-precio">$ 850.000 ARS</p>
            </div>
          </article>

          <article className="home-tarjeta">
            <img src="/imagenes/joyas_collar.jpg" alt="Colgante Luminance en platino noble con diamante talla esmeralda" />
            <div className="home-tarjeta-cuerpo">
              <span className="home-tarjeta-metal">Platino noble</span>
              <h3>Colgante Luminance</h3>
              <p>Cadena veneciana con diamante talla esmeralda de excepcional claridad y engarce biselado en platino puro.</p>
              <p className="home-tarjeta-precio">$ 1.250.000 ARS</p>
            </div>
          </article>

          <article className="home-tarjeta">
            <img src="/imagenes/joyas_aros.jpg" alt="Par de aros Royal Brilliance en oro blanco 18k con corte baguette" />
            <div className="home-tarjeta-cuerpo">
              <span className="home-tarjeta-metal">Oro blanco 18k</span>
              <h3>Aros Royal Brilliance</h3>
              <p>Par de aros colgantes en oro blanco 18k con corte baguette deslumbrante.</p>
              <p className="home-tarjeta-precio">$ 620.000 ARS</p>
            </div>
          </article>
        </div>

        <div className="home-acciones home-acciones-centradas">
          <Link to="/catalogo" className="home-accion-principal">
            Explorá el catálogo completo
          </Link>
        </div>
      </section>

      <section className="home-seccion">
        <h2>Tarifas de referencia de materiales</h2>
        <p className="home-subtitulo">
          Costos estándar por gramo de metal y mano de obra especializada utilizados en nuestro taller.
        </p>

        <div className="home-tabla-contenedor" tabIndex={0} role="region" aria-labelledby="tarifas-caption">
          <table className="home-tabla">
            <caption id="tarifas-caption">Tabla de valores de referencia por gramo de metal precioso</caption>
            <thead>
              <tr>
                <th scope="col">Metal precioso</th>
                <th scope="col">Pureza / Ley</th>
                <th scope="col">Valor estimado por gramo</th>
                <th scope="col">Acabado disponible</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Oro 18k (amarillo / blanco / rosa)</th>
                <td>18 quilates (750)</td>
                <td>$ 95.000 ARS</td>
                <td>Pulido espejo o satinado</td>
              </tr>
              <tr>
                <th scope="row">Plata 925 de ley</th>
                <td>925 milésimas</td>
                <td>$ 12.000 ARS</td>
                <td>Envejecido o rodinado</td>
              </tr>
              <tr>
                <th scope="row">Platino 950 noble</th>
                <td>950 milésimas</td>
                <td>$ 110.000 ARS</td>
                <td>Brillo de alta durabilidad</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="home-seccion home-cotizador">
        <h2>¿Querés una pieza a medida?</h2>
        <p className="home-subtitulo">
          Diseñá tu joya personalizada calculando en tiempo real el valor según el tipo de metal precioso, peso en gramos, cantidad de gemas y servicio de grabado artesanal.
        </p>
        <div className="home-acciones home-acciones-centradas">
          <Link to="/cotizador" className="home-accion-principal">
            Probá el cotizador interactivo
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
