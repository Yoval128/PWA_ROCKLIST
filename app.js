// Punto 2.1: Registro del Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registrado correctamente.'))
        .catch(err => console.log('Error en Service Worker:', err));
}

// Transición Splash Screen
setTimeout(() => {
    document.getElementById('splash').classList.add('oculto');
    document.getElementById('home').classList.remove('oculto');
    renderizarLista();
}, 2000);

const rockForm = document.getElementById('rockForm');
const songList = document.getElementById('songList');
const statusBadge = document.getElementById('status');
const btnNotificaciones = document.getElementById('btnNotificaciones');
const btnUbicacion = document.getElementById('btnUbicacion');
const txtUbicacion = document.getElementById('txtUbicacion');

let ubicacionActual = "Desconocida"; // Variable para guardar el GPS

// --- PUNTO 2.3: NOTIFICACIONES LOCALES ---
btnNotificaciones.addEventListener('click', () => {
    if (!("Notification" in window)) {
        alert("Este navegador no soporta notificaciones de escritorio");
        return;
    }
    
    // Solicitar permiso al usuario
    Notification.requestPermission().then(permiso => {
        if (permiso === "granted") {
            new Notification("¡RockList Listo!", {
                body: "Te avisaremos cuando agregues canciones al setlist",
                icon: "https://cdn-icons-png.flaticon.com/512/3211/3211422.png"
            });
            btnNotificaciones.style.display = 'none'; // Ocultar botón si ya dio permiso
        } else {
            alert("Permiso denegado para notificaciones.");
        }
    });
});

// Ocultar botón si el permiso ya estaba concedido de antes
if (Notification.permission === 'granted') {
    btnNotificaciones.style.display = 'none';
}

// --- PUNTO 2.4: ACCESO A CARACTERÍSTICA FÍSICA (GEOLOCALIZACIÓN) ---
btnUbicacion.addEventListener('click', () => {
    if ("geolocation" in navigator) {
        txtUbicacion.textContent = "Buscando coordenadas...";
        
        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                const lat = posicion.coords.latitude;
                const lon = posicion.coords.longitude;
                ubicacionActual = `${lat}, ${lon}`;
                txtUbicacion.textContent = `Ubicación: ${ubicacionActual}`;
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
window.addEventListener('online', actualizarEstadoRed);
window.addEventListener('offline', actualizarEstadoRed);

function actualizarEstadoRed() {
    if (navigator.onLine) {
        statusBadge.textContent = 'Conectado';
        statusBadge.classList.remove('offline');
        sincronizarDatos();
    } else {
        statusBadge.textContent = 'Sin conexión';
        statusBadge.classList.add('offline');
        // Aviso de que se necesita conexión para sincronizar
        alert("Aviso: Estás sin conexión. Los datos se guardarán localmente."); 
    }
}

// --- GUARDAR Y RENDERIZAR DATOS ---
rockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const cancion = document.getElementById('song').value;
    const banda = document.getElementById('band').value;
    
    const nuevaRola = { 
        cancion, 
        banda, 
        ubicacion: ubicacionActual, // Integramos el GPS
        id: Date.now(), 
        sincronizado: navigator.onLine 
    };

    let setlist = JSON.parse(localStorage.getItem('setlist')) || [];
    setlist.push(nuevaRola);
    localStorage.setItem('setlist', JSON.stringify(setlist));

    // Disparar Notificación si hay permiso
    if (Notification.permission === "granted") {
        new Notification("¡Nueva canción!", {
            body: `${cancion} de ${banda} se agregó al setlist.`,
            icon: "https://cdn-icons-png.flaticon.com/512/3211/3211422.png"
        });
    }

    document.getElementById('rockForm').reset();
    txtUbicacion.textContent = "Ubicación no capturada";
    ubicacionActual = "Desconocida";
    renderizarLista();
});

function renderizarLista() {
    let setlist = JSON.parse(localStorage.getItem('setlist')) || [];
    songList.innerHTML = ''; 
    
    setlist.forEach(rola => {
        let li = document.createElement('li');
        li.innerHTML = `<strong>${rola.cancion}</strong> - ${rola.banda} <br>
                        <small>GPS: ${rola.ubicacion}</small><br>
                        <small>(${rola.sincronizado ? 'Guardado' : 'Pendiente'})</small>`;
        songList.appendChild(li);
    });
}

function sincronizarDatos() {
    let setlist = JSON.parse(localStorage.getItem('setlist')) || [];
    setlist.forEach(rola => {
        if (!rola.sincronizado) rola.sincronizado = true;
    });
    localStorage.setItem('setlist', JSON.stringify(setlist));
    renderizarLista();
}

actualizarEstadoRed();