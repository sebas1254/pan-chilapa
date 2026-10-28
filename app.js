// 1. Catálogo de productos con soporte para múltiples tamaños
const productos = [
    { 
        id: 1, nombre: "Concha de Vainilla", img: "img/concha.webp", 
        variantes: [{ tamaño: "Grande", precio: 55 }] 
    },
    { 
        id: 2, nombre: "Regañadas", img: "img/reganadas.webp", 
        variantes: [{ tamaño: "Grande", precio: 55 }] 
    },
    { 
        id: 3, nombre: "Camarón", img: "img/camaron.webp", 
        variantes: [{ tamaño: "Grande", precio: 55 }] 
    },
    { 
        id: 4, nombre: "Chilapeña", img: "img/chilapena.webp", 
        variantes: [{ tamaño: "Grande", precio: 55 }] 
    },
    { 
        id: 5, nombre: "Semita de Requesón con Piloncillo", img: "img/semita.webp", 
        variantes: [
            { tamaño: "Grande", precio: 50 }, 
            { tamaño: "Extra grande", precio: 70 }
        ] 
    },
    { 
        id: 6, nombre: "Amargoza con Ajonjolí", img: "img/amargozaajonjoli.webp", 
        variantes: [{ tamaño: "Grande", precio: 55 }] 
    },
    { 
        id: 7, nombre: "Amargoza con azúcar", img: "img/amargozaazucar.webp", 
        variantes: [{ tamaño: "Grande", precio: 55 }] 
    },
    { 
        id: 8, nombre: "Torta", img: "img/blanco.webp", 
        variantes: [
            { tamaño: "Chico", precio: 9 }, 
            { tamaño: "Mediano", precio: 18 }, 
            { tamaño: "Grande", precio: 25 }, 
            { tamaño: "Extra grande", precio: 35 }
        ] 
    },
    { 
        id: 9, nombre: "Muñeco", img: "img/muneco.webp", 
        variantes: [
            { tamaño: "Chico", precio: 8 }, 
            { tamaño: "Grande", precio: 12 }
        ] 
    },
    { 
        id: 10, nombre: "Panela de Chilapa (2pz)", img: "img/panela.webp", 
        variantes: [{ tamaño: "Grande", precio: 65 }] 
    }
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
        
        let opcionesHTML = '';
        prod.variantes.forEach((variante, index) => {
            // Se quitó "MXN" para que quepa bien en pantallas pequeñas
            opcionesHTML += `<option value="${index}">${variante.tamaño} - $${variante.precio}</option>`;
        });

        let mostrarSelect = prod.variantes.length > 1 ? 'block' : 'none';
        let mostrarTextoFijo = prod.variantes.length === 1 ? 'block' : 'none';

        grid.innerHTML += `
            <div class="product-card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <img src="${prod.img}" alt="${prod.nombre}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px;">
                <h3 style="font-size: 1.1rem; margin: 10px 0 5px 0;">${prod.nombre}</h3>
                
                <!-- Modo: Tamaño Único -->
                <div style="display: ${mostrarTextoFijo}; margin-bottom: 10px;">
                    <p style="margin: 5px 0; font-size: 0.9rem; color: var(--negro);">Tamaño: ${prod.variantes[0]?.tamaño}</p>
                    <p style="margin: 5px 0; font-size: 1.1rem; color: var(--morado);"><strong>$${prod.variantes[0]?.precio} MXN</strong></p>
                </div>

                <!-- Modo: Varios Tamaños -->
                <div class="variant-container" style="display: ${mostrarSelect}; margin: 10px 0; width: 100%;">
                    <label for="var-${prod.id}" style="font-size: 0.85rem; font-weight: bold; color: var(--negro); display: block; text-align: left; margin-bottom: 5px;">Tamaño:</label>
                    <select id="var-${prod.id}" style="width: 100%; max-width: 100%; box-sizing: border-box; padding: 10px 5px; border-radius: 8px; border: 2px solid var(--morado); font-size: 0.95rem; font-weight: bold; color: var(--morado); outline: none; background: white; text-overflow: ellipsis;">
                        ${opcionesHTML}
                    </select>
                </div>
                
                <div class="quantity-container" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label for="qty-${prod.id}" style="font-size: 0.9rem; font-weight: bold; color: var(--negro);">Cant:</label>
                    <input type="number" id="qty-${prod.id}" value="1" min="1" max="99" style="width: 60px; padding: 8px; border: 2px solid var(--morado); border-radius: 8px; text-align: center; font-size: 16px; font-weight: bold; color: var(--morado); outline: none; box-sizing: border-box;">
                </div>
                <button class="btn-add" onclick="agregarAlCarrito(${prod.id})" style="margin-top: auto; padding: 12px; background: var(--morado); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">Agregar</button>
            </div>
        `;
    });
}

function agregarAlCarrito(id) {
    const inputCantidad = document.getElementById(`qty-${id}`);
    const cantidadSeleccionada = parseInt(inputCantidad.value);
    
    // Identificar qué variante escogió el usuario
    const selectVariante = document.getElementById(`var-${id}`);
    const indexVariante = selectVariante ? selectVariante.value : 0;

    if (isNaN(cantidadSeleccionada) || cantidadSeleccionada <= 0) {
        alert("Por favor ingresa una cantidad válida.");
        return;
    }

    const productoBase = productos.find(p => p.id === id);
    const varianteSeleccionada = productoBase.variantes[indexVariante];
    
    // Creamos un ID único combinando el ID del pan y el tamaño (Ej: "5-Extra grande")
    const idUnicoEnCarrito = `${id}-${varianteSeleccionada.tamaño}`;
    const itemEnCarrito = carrito.find(item => item.idUnico === idUnicoEnCarrito);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cantidadSeleccionada;
    } else {
        carrito.push({ 
            idUnico: idUnicoEnCarrito,
            idBase: id,
            nombre: productoBase.nombre,
            tamaño: varianteSeleccionada.tamaño,
            precio: varianteSeleccionada.precio,
            cantidad: cantidadSeleccionada 
        });
    }
    
    inputCantidad.value = 1; 
    actualizarCarrito();
    mostrarNotificacion(cantidadSeleccionada, `${productoBase.nombre} (${varianteSeleccionada.tamaño})`);
}

function cambiarCantidad(idUnico, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    const item = carrito.find(i => i.idUnico === idUnico);
    
    if (item) {
        if (cantidad > 0) {
            item.cantidad = cantidad;
        } else {
            eliminarDelCarrito(idUnico);
        }
        actualizarCarrito();
    }
}

function eliminarDelCarrito(idUnico) {
    carrito = carrito.filter(item => item.idUnico !== idUnico);
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
                    <input type="number" value="${item.cantidad}" min="1" onchange="cambiarCantidad('${item.idUnico}', this.value)">
                    <button class="btn-delete" onclick="eliminarDelCarrito('${item.idUnico}')">❌</button>
                </div>
            </div>
        `;
    });
    
    totalPriceEl.innerText = total;
    anticipoPriceEl.innerText = Math.round(total * 0.30); 
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
    fechaEntregaInput.value = ""; 
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