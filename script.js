/* ===========================
   FANTASY ELITE — JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

    // === Verificación de Edad ===
    const puertaEdad = document.getElementById('puertaEdad');
    const aceptarEdad = document.getElementById('aceptarEdad');
    const denegarEdad = document.getElementById('denegarEdad');

    // Comprobar si ya se verificó en esta sesión
    if (sessionStorage.getItem('edadVerificada') === 'true') {
        puertaEdad.classList.add('hidden'); // hidden puede mantenerse ya que es una clase utilitaria genérica, pero la cambiaremos a oculta en CSS si es necesario. (Mejor usar 'oculto')
        document.body.style.overflow = '';
    } else {
        document.body.style.overflow = 'hidden';
    }

    aceptarEdad.addEventListener('click', () => {
        sessionStorage.setItem('edadVerificada', 'true');
        puertaEdad.classList.add('oculto');
        document.body.style.overflow = '';
    });

    denegarEdad.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });

    // === Precargador ===
    const precargador = document.getElementById('precargador');
    window.addEventListener('load', () => {
        setTimeout(() => {
            precargador.classList.add('oculto');
        }, 800);
    });
    // Respaldo si la carga ya se completó
    if (document.readyState === 'complete') {
        setTimeout(() => precargador.classList.add('oculto'), 800);
    }

    // === Scroll de la Barra de Navegación ===
    const barraNavegacion = document.getElementById('barraNavegacion');
    const enlacesNavegacion = document.querySelectorAll('.enlace-navegacion');
    const secciones = document.querySelectorAll('.seccion, .portada');

    function manejarScroll() {
        const scrollY = window.scrollY;

        // Fondo de la barra
        if (scrollY > 80) {
            barraNavegacion.classList.add('scrolled'); // Cambiaremos scrolled a con-scroll en CSS
        } else {
            barraNavegacion.classList.remove('con-scroll');
            // Aseguramos remover la clase anterior por si acaso
            barraNavegacion.classList.remove('scrolled'); 
        }
        
        // Agregar la clase de scroll español (hacer ambos para compatibilidad temporal si no se renombra bien en CSS)
        if (scrollY > 80) {
            barraNavegacion.classList.add('con-scroll');
        }

        // Enlace activo
        let actual = '';
        secciones.forEach(seccion => {
            const topeSeccion = seccion.offsetTop - 120;
            if (scrollY >= topeSeccion) {
                actual = seccion.getAttribute('id');
            }
        });
        enlacesNavegacion.forEach(enlace => {
            enlace.classList.remove('activo');
            if (enlace.getAttribute('href') === `#${actual}`) {
                enlace.classList.add('activo');
            }
        });
    }
    window.addEventListener('scroll', manejarScroll);
    manejarScroll();

    // === Menú Móvil ===
    const botonNavegacion = document.getElementById('botonNavegacion');
    const menuNavegacion = document.getElementById('menuNavegacion');

    botonNavegacion.addEventListener('click', () => {
        botonNavegacion.classList.toggle('activo');
        menuNavegacion.classList.toggle('activo');
        document.body.style.overflow = menuNavegacion.classList.contains('activo') ? 'hidden' : '';
    });

    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', () => {
            botonNavegacion.classList.remove('activo');
            menuNavegacion.classList.remove('activo');
            document.body.style.overflow = '';
        });
    });

    // === Scroll Suave ===
    document.querySelectorAll('a[href^="#"]').forEach(ancla => {
        ancla.addEventListener('click', (e) => {
            e.preventDefault();
            const destino = document.querySelector(ancla.getAttribute('href'));
            if (destino) {
                const topeOffset = destino.offsetTop - 80;
                window.scrollTo({
                    top: topeOffset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Animación de Revelado al hacer Scroll ===
    const elementosRevelar = document.querySelectorAll('.revelar-arriba, .revelar-izq, .revelar-der');
    
    const observadorRevelar = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const retardo = entrada.target.dataset.delay || 0;
                setTimeout(() => {
                    entrada.target.classList.add('revelado');
                }, parseInt(retardo));
                observadorRevelar.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    elementosRevelar.forEach(el => observadorRevelar.observe(el));

    // === Contador Animado ===
    const numerosEstadistica = document.querySelectorAll('.numero-estadistica');
    
    const observadorContador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const objetivo = parseInt(entrada.target.dataset.target);
                animarContador(entrada.target, objetivo);
                observadorContador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.5 });

    numerosEstadistica.forEach(num => observadorContador.observe(num));

    function animarContador(elemento, objetivo) {
        const duracion = 2000;
        const tiempoInicio = performance.now();
        
        function actualizar(tiempoActual) {
            const transcurrido = tiempoActual - tiempoInicio;
            const progreso = Math.min(transcurrido / duracion, 1);
            
            // Suavizado de salida (Ease out quad)
            const suavizado = 1 - (1 - progreso) * (1 - progreso);
            const actual = Math.floor(suavizado * objetivo);
            
            elemento.textContent = actual;
            
            if (progreso < 1) {
                requestAnimationFrame(actualizar);
            }
        }
        requestAnimationFrame(actualizar);
    }

    // === Manejo de Formularios (Formspree Fetch) ===
    const formularioPersonalizado = document.getElementById('formularioPersonalizado');
    const formularioContacto = document.getElementById('formularioContacto');
    const modalExito = document.getElementById('modalExito');
    const cerrarModal = document.getElementById('cerrarModal');
    const FORMSPREE_URL = "https://formspree.io/f/xdabparq";

    function mostrarModal() {
        modalExito.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }

    function ocultarModal() {
        modalExito.classList.remove('activo');
        document.body.style.overflow = '';
    }

    cerrarModal.addEventListener('click', ocultarModal);
    modalExito.addEventListener('click', (e) => {
        if (e.target === modalExito) ocultarModal();
    });

    // Función genérica para manejar el envío
    async function manejarEnvioFormulario(e, formulario) {
        e.preventDefault();
        
        // Comprobar consentimiento de edad específico para cada formulario
        const checkConsentimiento = formulario.id === 'formularioPersonalizado' ? 
                                  document.getElementById('consent') : 
                                  document.getElementById('cAge');
                                  
        if (!checkConsentimiento.checked) {
            alert('Debes confirmar que eres mayor de edad.');
            return;
        }

        const btnEnvio = formulario.querySelector('button[type="submit"]');
        const textoOriginal = btnEnvio.innerHTML;
        btnEnvio.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        btnEnvio.disabled = true;

        const formData = new FormData(formulario);
        // Añadir una etiqueta para identificar de qué formulario viene
        formData.append('_subject', formulario.id === 'formularioPersonalizado' ? 'Nueva Solicitud de Fantasía' : 'Nuevo Mensaje de Contacto');

        try {
            const respuesta = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (respuesta.ok) {
                mostrarModal();
                formulario.reset();
            } else {
                alert("Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al enviar formspree:", error);
            alert("Error de red. Verifica tu conexión e inténtalo de nuevo.");
        } finally {
            btnEnvio.innerHTML = textoOriginal;
            btnEnvio.disabled = false;
        }
    }

    // Formulario de Fantasía Personalizada
    if (formularioPersonalizado) {
        formularioPersonalizado.addEventListener('submit', (e) => manejarEnvioFormulario(e, formularioPersonalizado));
    }

    // Formulario de Contacto
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', (e) => manejarEnvioFormulario(e, formularioContacto));
    }

    // === Imagen Hero Parallax ===
    const imgFondoPortada = document.querySelector('.img-fondo-portada');
    
    if (imgFondoPortada && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scroleado = window.scrollY;
            if (scroleado < window.innerHeight) {
                imgFondoPortada.style.transform = `scale(${1.05 + scroleado * 0.0003}) translateY(${scroleado * 0.15}px)`;
            }
        }, { passive: true });
    }

    // === Tarjetas de Servicio - Efecto Inclinación (Tilt) ===
    const tarjetasServicio = document.querySelectorAll('.tarjeta-servicio');
    
    if (window.innerWidth > 768) {
        tarjetasServicio.forEach(tarjeta => {
            tarjeta.addEventListener('mousemove', (e) => {
                const rect = tarjeta.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centroX = rect.width / 2;
                const centroY = rect.height / 2;
                const rotarX = (y - centroY) / 20;
                const rotarY = (centroX - x) / 20;
                
                tarjeta.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotarX}deg) rotateY(${rotarY}deg)`;
            });
            
            tarjeta.addEventListener('mouseleave', () => {
                tarjeta.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // === Teclado - Cerrar menú/modal con Escape ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (menuNavegacion.classList.contains('activo')) {
                botonNavegacion.classList.remove('activo');
                menuNavegacion.classList.remove('activo');
                document.body.style.overflow = '';
            }
            if (modalExito.classList.contains('activo')) {
                ocultarModal();
            }
        }
    });

});
