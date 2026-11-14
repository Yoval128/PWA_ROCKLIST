// --- PUNTO 2.1: Registro del Service Worker ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registrado correctamente.'))
        .catch(err => console.log('Error en Service Worker:', err));
}

// --- Transición Splash Screen ---
setTimeout(() => {
    document.getElementById('splash').classList.add('oculto');
    document.getElementById('home').classList.remove('oculto');
    renderizarLista();
}, 2000);

const rockForm          = document.getElementById('rockForm');
const songList          = document.getElementById('songList');
const statusBadge       = document.getElementById('status');
const btnNotificaciones = document.getElementById('btnNotificaciones');
const btnUbicacion      = document.getElementById('btnUbicacion');
const txtUbicacion      = document.getElementById('txtUbicacion');
const syncBtn           = document.getElementById('syncBtn');

let ubicacionActual = "Desconocida";

// --- PUNTO 2.3: NOTIFICACIONES LOCALES ---
btnNotificaciones.addEventListener('click', () => {
    if (!("Notification" in window)) {
        alert("Este navegador no soporta notificaciones de escritorio");
        return;
    }

    Notification.requestPermission().then(permiso => {
        if (permiso === "granted") {
            new Notification("¡RockList Listo!", {
                body: "Te avisaremos cuando agregues canciones al setlist",
                icon: "https://cdn-icons-png.flaticon.com/512/3211/3211422.png"
            });
            btnNotificaciones.classList.add('oculto');
        } else {
            alert("Permiso denegado para notificaciones.");
        }
    });
});

if (Notification.permission === 'granted') {
    btnNotificaciones.classList.add('oculto');
}

// --- PUNTO 2.4: GEOLOCALIZACIÓN ---
btnUbicacion.addEventListener('click', () => {
    if ("geolocation" in navigator) {
        txtUbicacion.textContent = "Buscando coordenadas...";

        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                const lat = posicion.coords.latitude.toFixed(5);
                const lon = posicion.coords.longitude.toFixed(5);
                ubicacionActual = `${lat}, ${lon}`;
                txtUbicacion.textContent = `📍 ${ubicacionActual}`;
            },
            (error) => {
                txtUbicacion.textContent = "Error o permiso de GPS denegado.";
                console.error(error);
            }
        );
    } else {
        txtUbicacion.textContent = "Tu navegador no soporta geolocalización.";
    }
});

// --- ESTADO DE RED ---
window.addEventListener('online',  actualizarEstadoRed);
window.addEventListener('offline', actualizarEstadoRed);

function actualizarEstadoRed() {
    if (navigator.onLine) {
        statusBadge.textContent = 'Conectado';
        statusBadge.classList.remove('offline');
        sincronizarDatos();
    } else {
        statusBadge.textContent = 'Sin conexión';
        statusBadge.classList.add('offline');
        syncBtn.classList.remove('oculto');
    }
}

// Botón de sincronización manual
syncBtn.addEventListener('click', () => {
    if (navigator.onLine) {
        sincronizarDatos();
        syncBtn.classList.add('oculto');
    } else {
        alert("Aún sin conexión. Intenta más tarde.");
    }
});

// --- GUARDAR CANCIÓN ---
rockForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cancion = document.getElementById('song').value.trim();
    const banda   = document.getElementById('band').value.trim();

    const nuevaRola = {
        cancion,
        banda,
        ubicacion:   ubicacionActual,
        id:          Date.now(),
        sincronizado: navigator.onLine
    };

    let setlist = JSON.parse(localStorage.getItem('setlist')) || [];
    setlist.push(nuevaRola);
    localStorage.setItem('setlist', JSON.stringify(setlist));

    if (Notification.permission === "granted") {
        new Notification("¡Nueva canción!", {
            body: `${cancion} de ${banda} se agregó al setlist.`,
            icon: "https://cdn-icons-png.flaticon.com/512/3211/3211422.png"
        });
    }

    rockForm.reset();
    txtUbicacion.textContent = "Ubicación no capturada";
    ubicacionActual = "Desconocida";
    renderizarLista();
});

// --- ELIMINAR CANCIÓN ---
function eliminarCancion(id) {
    let setlist = JSON.parse(localStorage.getItem('setlist')) || [];
    setlist = setlist.filter(r => r.id !== id);
    localStorage.setItem('setlist', JSON.stringify(setlist));
    renderizarLista();
}

// --- RENDERIZAR LISTA ---
function renderizarLista() {
    let setlist = JSON.parse(localStorage.getItem('setlist')) || [];
    songList.innerHTML = '';

    if (setlist.length === 0) {
        songList.innerHTML = '<li style="border-left-color: var(--color-muted); opacity:0.6;"><span class="li-info">No hay canciones aún. ¡Agrega la primera!</span></li>';
        return;
    }

    setlist.forEach(rola => {
        const sincLabel = rola.sincronizado ? 'Guardado' : 'Pendiente';
        const sincClass = rola.sincronizado ? '' : 'pendiente';

        const li = document.createElement('li');
        li.setAttribute('role', 'listitem');
        li.innerHTML = `
            <div class="li-info">
                <strong>${rola.cancion}</strong>
                <span class="li-band">${rola.banda}</span>
                <small>📍 GPS: ${rola.ubicacion}</small>
                <span class="tag-sync ${sincClass}">${sincLabel}</span>
            </div>
            <button class="btn-danger" onclick="eliminarCancion(${rola.id})" aria-label="Eliminar ${rola.cancion}">✕</button>
        `;
        songList.appendChild(li);
    });
}

// --- SINCRONIZAR PENDIENTES ---
function sincronizarDatos() {
    let setlist = JSON.parse(localStorage.getItem('setlist')) || [];
    let hubocambios = false;

    setlist.forEach(rola => {
        if (!rola.sincronizado) {
            rola.sincronizado = true;
            hubocambios = true;
        }
    });

    if (hubocambios) {
        localStorage.setItem('setlist', JSON.stringify(setlist));
        renderizarLista();
    }
}

// Estado inicial
actualizarEstadoRed();
