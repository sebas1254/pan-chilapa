// Catálogo de productos
const productos = [
    { id: 1, nombre: "Concha de Vainilla", img: "img/concha.webp", tamaño: "Grande", precio: 55 },
    { id: 2, nombre: "Regañadas", img: "img/reganadas.webp", tamaño: "Grande", precio: 55 },
    { id: 3, nombre: "Camarón", img: "img/camaron.webp", tamaño: "Grande", precio: 55 },
    { id: 4, nombre: "Chilapeña", img: "img/chilapena.webp", tamaño: "Grande", precio: 55 },
    { id: 5, nombre: "Semita de Requesón con Piloncillo", img: "img/semita.webp", tamaño: "Grande", precio: 55 },
    { id: 6, nombre: "Amargoza con Ajonjoli", img: "img/amargozaajonjoli.webp", tamaño: "Grande", precio: 55 },
    { id: 7, nombre: "Amargoza con azúcar", img: "img/amargozaazucar.webp", tamaño: "Grande", precio: 55 },
    { id: 8, nombre: "Muñeco", img: "img/muneco.webp", tamaño: "Chico", precio: 7 }
];

let carrito = [];

const grid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const fechaEntregaInput = document.getElementById('fecha-entrega');
const anticipoPriceEl = document.getElementById('anticipo-price');

// Bloquear fechas anteriores a hoy en el calendario
const hoy = new Date().toISOString().split('T')[0];
if (fechaEntregaInput) fechaEntregaInput.setAttribute('min', hoy);

function renderizarProductos() {
    grid.innerHTML = '';
    productos.forEach(prod => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${prod.img}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p style="margin: 5px 0; font-size: 0.9rem; color: var(--negro);">Tamaño: ${prod.tamaño}</p>
                <p style="margin: 5px 0; font-size: 1.1rem; color: var(--morado);"><strong>$${prod.precio} MXN</strong></p>
                
                <div class="quantity-container">
                    <label for="qty-${prod.id}">Cantidad:</label>
                    <input type="number" id="qty-${prod.id}" value="1" min="1" max="99">
                </div>
                <button class="btn-add" onclick="agregarAlCarrito(${prod.id})">Agregar al Carrito</button>
            </div>
        `;
    });
}

function agregarAlCarrito(id) {
    const inputCantidad = document.getElementById(`qty-${id}`);
    const cantidadSeleccionada = parseInt(inputCantidad.value);

    if (isNaN(cantidadSeleccionada) || cantidadSeleccionada <= 0) {
        alert("Por favor ingresa una cantidad válida.");
        return;
    }

    const producto = productos.find(p => p.id === id);
    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cantidadSeleccionada;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            tamaño: producto.tamaño,
            precio: producto.precio,
            cantidad: cantidadSeleccionada
        });
    }

    inputCantidad.value = 1;
    actualizarCarrito();
    mostrarNotificacion(cantidadSeleccionada, producto.nombre);
}

function cambiarCantidad(id, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    const item = carrito.find(i => i.id === id);

    if (item) {
        if (cantidad > 0) {
            item.cantidad = cantidad;
        } else {
            eliminarDelCarrito(id);
        }
        actualizarCarrito();
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
}

function actualizarCarrito() {
    cartCount.innerText = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cartItemsContainer.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        total += (item.precio * item.cantidad);
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span>${item.nombre} <small>(${item.tamaño})</small></span>
                    <span>$${item.precio * item.cantidad}</span>
                </div>
                <div class="cart-item-actions">
                    <label>Cant:</label>
                    <input type="number" value="${item.cantidad}" min="1" onchange="cambiarCantidad(${item.id}, this.value)">
                    <button class="btn-delete" onclick="eliminarDelCarrito(${item.id})">❌</button>
                </div>
            </div>
        `;
    });

    // Actualizamos el total general y el cálculo del 30%
    totalPriceEl.innerText = total;
    anticipoPriceEl.innerText = Math.round(total * 0.30); // Redondeado para evitar centavos complicados
}

document.getElementById('btn-whatsapp').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    if (!fechaEntregaInput.value) {
        alert("Por favor, selecciona una fecha para la entrega de tus panes.");
        return;
    }

    const numeroWhatsApp = "527471729916";
    let total = 0;

    // Formatear la fecha para que se lea mejor en WhatsApp
    const fechaElegida = fechaEntregaInput.value.split('-').reverse().join('/');

    let texto = `¡Hola! Quiero realizar el siguiente pedido para el día *${fechaElegida}*:\n\n`;

    carrito.forEach(item => {
        texto += `🍞 ${item.cantidad}x ${item.nombre} (${item.tamaño}) - $${item.precio * item.cantidad}\n`;
        total += (item.precio * item.cantidad);
    });

    const anticipo = Math.round(total * 0.30);

    texto += `\n*Total del pedido: $${total} MXN*`;
    texto += `\n*Anticipo requerido (30%): $${anticipo} MXN*\n\n`;
    texto += `(Quedo atento para coordinar el pago del anticipo y asegurar mi apartado).`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');

    carrito = [];
    fechaEntregaInput.value = ""; // Limpiamos la fecha
    actualizarCarrito();
    cartModal.classList.add('hidden');
});

document.getElementById('cart-icon').addEventListener('click', () => cartModal.classList.remove('hidden'));
document.getElementById('btn-close-cart').addEventListener('click', () => cartModal.classList.add('hidden'));

renderizarProductos();

function mostrarNotificacion(cantidad, nombre) {
    const toast = document.getElementById("toast");
    toast.innerText = `¡${cantidad}x ${nombre} agregado(s)! 🥖`;
    toast.className = "toast show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}