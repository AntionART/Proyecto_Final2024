// Obtener y mostrar foros
async function fetchForos() {
    try {
        const response = await fetch('http://localhost:5000/api/foros');
        if (!response.ok) throw new Error('Error al obtener los foros');
        const foros = await response.json();
        const forosContainer = document.getElementById('foros');
        forosContainer.innerHTML = '';

        foros.forEach(foro => {
            const foroDiv = document.createElement('div');
            foroDiv.classList.add('foro-publicacion');
            foroDiv.innerHTML = `
                <strong>${foro.nombre}</strong> (${foro.correo}) - ${foro.tematica}:
                <p>${foro.mensaje}</p>
                <img src="${foro.imagenURL}" alt="Imagen del foro" style="max-width: 100%; height: auto;">
                <em>${new Date(foro.fecha).toLocaleString()}</em>
            `;
            forosContainer.appendChild(foroDiv);
        });
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar los foros.');
    }
}

// Crear nuevo foro
async function crearForo(event) {
    event.preventDefault();
    const form = event.target;
    const nombre = form.nombre.value;
    const correo = form.correo.value;
    const tematica = form.tematica.value;
    const mensaje = form.mensaje.value;
    const imagenURL = form.imagenURL.value;

    try {
        const response = await fetch('http://localhost:5000/api/foros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, correo, tematica, mensaje, imagenURL })
        });

        if (!response.ok) throw new Error('Error al crear el foro');

        form.reset();
        fetchForos(); // Actualiza la lista de foros
    } catch (error) {
        console.error(error);
        alert('No se pudo crear el foro.');
    }
}

// Obtener y mostrar gastos
async function fetchGastos() {
    try {
        const response = await fetch('http://localhost:5000/api/gastos');
        if (!response.ok) throw new Error('Error al obtener los gastos');
        const gastos = await response.json();
        const gastosContainer = document.getElementById('gastosLista');
        const totalGastosElement = document.getElementById('totalGastos');
        gastosContainer.innerHTML = '';

        let totalGastado = 0;

        gastos.forEach(gasto => {
            const gastoDiv = document.createElement('tr');
            gastoDiv.innerHTML = `
                <td>${gasto.nombreGasto}</td>
                <td>${new Date(gasto.fechaGasto).toLocaleDateString()}</td>
                <td>${gasto.cantidad}</td>
                <td>${gasto.totalGastado}</td>
                <td><button onclick="eliminarGasto('${gasto._id}')">Eliminar</button></td>
            `;
            gastosContainer.appendChild(gastoDiv);

            totalGastado += parseFloat(gasto.totalGastado);
        });

        totalGastosElement.innerText = `Total Gastado: $${totalGastado.toFixed(2)}`;

        actualizarGrafica(gastos); // Actualizar gráfica con los gastos
    } catch (error) {
        console.error(error);
        alert('Cargando');
    }
}

// Crear un nuevo gasto
async function agregarGasto(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional y recargue la página

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);  // Convierte los datos del formulario a un objeto

    try {
        const response = await fetch('http://localhost:5000/api/gastos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)  // Envía los datos como JSON
        });

        if (!response.ok) {
            throw new Error('Error al guardar el gasto');
        }

        const gastoCreado = await response.json();
        console.log('Gasto creado:', gastoCreado);
        fetchGastos(); // Actualizar la lista de gastos
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
    }
}

// Eliminar un gasto
async function eliminarGasto(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/gastos/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar el gasto');

        fetchGastos(); // Vuelve a cargar los gastos después de eliminar
    } catch (error) {
        console.error(error);
        alert('No se pudo eliminar el gasto.');
    }
}

// Agregar un nuevo comentario
async function agregarComentario(event) {
    event.preventDefault();
    const form = event.target;
    const usuario = form.usuario.value;
    const correo = form.correo.value;
    const mensaje = form.mensaje.value;

    try {
        const response = await fetch('http://localhost:5000/api/comentarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, correo, mensaje })
        });

        if (!response.ok) throw new Error('Error al agregar el comentario');

        form.reset();
        fetchComentarios(); // Actualiza la lista de comentarios
    } catch (error) {
        console.error(error);
        alert('No se pudo agregar el comentario.');
    }
}

// Obtener y mostrar comentarios
async function fetchComentarios() {
    try {
        const response = await fetch('http://localhost:5000/api/comentarios');
        if (!response.ok) throw new Error('Error al obtener los comentarios');
        const comentarios = await response.json();
        const comentariosContainer = document.getElementById('comentarios');
        comentariosContainer.innerHTML = '';

        comentarios.forEach(comentario => {
            const comentarioDiv = document.createElement('div');
            comentarioDiv.classList.add('comentario');
            comentarioDiv.innerHTML = `
                <strong>${comentario.usuario}</strong> (${comentario.correo}):
                <p>${comentario.mensaje}</p>
                <em>${new Date(comentario.fecha).toLocaleString()}</em>
            `;
            comentariosContainer.appendChild(comentarioDiv);
        });
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar los comentarios.');
    }
}

// Actualizar gráfica de gastos
function actualizarGrafica(gastos) {
    const ctx = document.getElementById('gastosChart').getContext('2d');
    const labels = gastos.map(gasto => gasto.nombreGasto);
    const data = gastos.map(gasto => gasto.totalGastado);

    if (window.gastosChart) {
        window.gastosChart.destroy(); // Si ya existe, destrúyela
    }

    window.gastosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Gastado por Gasto',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para generar Excel
function generarExcel() {
    const table = document.getElementById("gastosTabla");
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, "Gastos.xlsx");
}

// Función para generar PDF
function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({ html: '#gastosTabla' });
    doc.save("Gastos.pdf");
}

document.addEventListener('DOMContentLoaded', () => {
    fetchForos();
    fetchGastos();
    fetchComentarios();
});

async function fetchGastos() {
    try {
        const response = await fetch('http://localhost:5000/api/gastos');
        if (!response.ok) throw new Error('Error al obtener los gastos');
        const gastos = await response.json();
        const gastosContainer = document.getElementById('gastosLista');
        const totalGastosElement = document.getElementById('totalGastos');
        gastosContainer.innerHTML = '';

        let totalGastado = 0;

        gastos.forEach(gasto => {
            const gastoDiv = document.createElement('tr');
            gastoDiv.innerHTML = `
                <td>${gasto.nombreGasto}</td>
                <td>${new Date(gasto.fechaGasto).toLocaleDateString()}</td>
                <td>${gasto.cantidad}</td>
                <td>${gasto.totalGastado}</td>
                <td><button onclick="eliminarGasto('${gasto._id}')">Eliminar</button></td>
            `;
            gastosContainer.appendChild(gastoDiv);

            totalGastado += parseFloat(gasto.totalGastado);
        });

        totalGastosElement.innerText = `Total Gastado: $${totalGastado.toFixed(2)}`;

        // Llamada a la función para actualizar la gráfica
        actualizarGrafica(gastos); // Actualizar gráfica con los gastos
    } catch (error) {
        console.error(error);
        alert('Cargando');
    }
}

// Actualizar gráfica de gastos
function actualizarGrafica(gastos) {
    const ctx = document.getElementById('gastosChart').getContext('2d');
    const labels = gastos.map(gasto => gasto.nombreGasto);
    const data = gastos.map(gasto => gasto.totalGastado);

    // Si ya existe una gráfica, la destruimos y la volvemos a crear
    if (window.gastosChart) {
        window.gastosChart.destroy();
    }

    window.gastosChart = new Chart(ctx, {
        type: 'bar', // Tipo de gráfica (barras)
        data: {
            labels: labels, // Los nombres de los gastos
            datasets: [{
                label: 'Total Gastado por Gasto',
                data: data, // Los valores del total gastado
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
                borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
                borderWidth: 1 // Ancho del borde
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true // El eje Y comienza desde 0
                }
            }
        }
    });
}


// Configuración de gráfica
function actualizarGrafica(gastos) {
    const ctx = document.getElementById('gastosChart').getContext('2d');
    const labels = gastos.map(gasto => gasto.nombreGasto);
    const data = gastos.map(gasto => parseFloat(gasto.totalGastado));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Llamar a las funciones para cargar los datos inicialmente
fetchForos();
fetchGastos();
fetchComentarios();