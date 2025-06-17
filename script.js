// Datos de ejemplo para productos
const products = [
    {
        id: 1,
        name: "Forum adidas",
        price: 89.99,
        category: "zapatillas",
        image: "./img/zapas1.webp",
        description: "Zapatillas Forum de Adidas con estilo clásico y comodidad moderna. Perfectas para el uso diario con suela de goma resistente."
    },
    {
        id: 2,
        name: "Campus adidas",
        price: 79.99,
        category: "zapatillas",
        image: "./img/zapas2.webp",
        description: "Campus Adidas con diseño retro y materiales de primera calidad. Combina estilo vintage con tecnología moderna."
    },
    {
        id: 3,
        name: "Samba adidas",
        price: 99.99,
        category: "zapatillas",
        image: "./img/zapas3.webp",
        description: "Zapatillas Samba clásicas con suela de goma y parte superior de cuero. Icónico diseño deportivo atemporal."
    },
    {
        id: 4,
        name: "Adidas bad bunny",
        price: 149.99,
        category: "zapatillas",
        image: "./img/zapas4.webp",
        description: "Colaboración exclusiva Adidas x Bad Bunny con diseño único y limitado. Edición especial para coleccionistas."
    },
    {
        id: 5,
        name: "Adidas forum bad bunny colab 2",
        price: 179.99,
        category: "accesorios",
        image: "./img/zapas5.webp",
        description: "Segunda colaboración Forum Bad Bunny con detalles únicos y colores vibrantes. Pieza exclusiva de colección."
    },
    {
        id: 6,
        name: "Super star",
        price: 69.99,
        category: "zapatillas",
        image: "./img/zapas6.webp",
        description: "Icónicas Superstar de Adidas con las tres rayas características y punta de concha. Un clásico reinventado."
    },
    {
        id: 7,
        name: "Nike legacy",
        price: 89.99,
        category: "zapatillas",
        image: "./img/zapas7.png",
        description: "Nike Legacy con tecnología moderna y diseño deportivo elegante. Comodidad y estilo en cada paso."
    },
    {
        id: 8,
        name: "Adidas forum",
        price: 85.99,
        category: "zapatillas",
        image: "./img/zapas8.webp",
        description: "Forum clásico con perfil bajo y estilo urbano contemporáneo. Perfectas para cualquier ocasión."
    }
];

// Variables globales
let cart = [];
let selectedProduct = null;
let selectedSize = null;
let quantity = 1;

// Función para cargar productos en la página
function loadProducts(category = null) {
    const productContainer = document.getElementById('featured-products');
    productContainer.innerHTML = '';
    
    let productsToShow = products;
    
    // Filtrar por categoría si se especifica
    if (category) {
        productsToShow = products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Crear tarjetas de productos
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='./img/placeholder.jpg'">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price.toFixed(2)}</div>
            </div>
        `;
        
        // Añadir evento de clic para ver detalles del producto
        productCard.addEventListener('click', () => {
            showProductModal(product);
        });
        
        productContainer.appendChild(productCard);
    });
}

// Función para mostrar el modal del producto
function showProductModal(product) {
    selectedProduct = product;
    selectedSize = null;
    quantity = 1;

    // Actualizar contenido del modal
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `${product.price.toFixed(2)}`;
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-image').alt = product.name;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('quantity').textContent = quantity;

    // Resetear selección de talla
    document.querySelectorAll('.size-option').forEach(option => {
        option.classList.remove('selected');
    });

    // Mostrar modal
    document.getElementById('product-modal').style.display = 'block';
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Función para añadir producto al carrito
function addToCart() {
    if (!selectedProduct) return;
    
    if (!selectedSize) {
        alert('Por favor selecciona una talla');
        return;
    }

    const cartItem = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        size: selectedSize,
        quantity: quantity,
        image: selectedProduct.image
    };

    // Verificar si el producto ya existe en el carrito con la misma talla
    const existingItemIndex = cart.findIndex(item => 
        item.id === cartItem.id && item.size === cartItem.size
    );

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push(cartItem);
    }

    updateCartCounter();
    showToast();
    closeModal();
    
    // Guardar carrito en localStorage
    saveCart();
    
    // Log para desarrollo (opcional)
    console.log('Carrito actualizado:', cart);
}

// Función para actualizar el contador del carrito
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-counter').textContent = totalItems;
}

// Función para mostrar notificación toast
function showToast() {
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Función para obtener el carrito (útil para otras funcionalidades)
function getCart() {
    return cart;
}

// Función para limpiar el carrito
function clearCart() {
    cart = [];
    updateCartCounter();
    saveCart();
}

// Función para guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('strivoCart', JSON.stringify(cart));
}

// Función para cargar carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('strivoCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCounter();
    }
}

// Función para ir al carrito
function goToCart() {
    saveCart(); // Asegurar que el carrito esté guardado
    window.location.href = 'cart.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cargar carrito guardado
    loadCart();
    
    // Cargar todos los productos al inicio
    loadProducts();
    
    // Configurar navegación por categorías
    const zapatillasLink = document.querySelector('a[href="#zapatillas"]');
    const accesoriosLink = document.querySelector('a[href="#accesorios"]');
    
    if (zapatillasLink) {
        zapatillasLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadProducts('zapatillas');
        });
    }
    
    if (accesoriosLink) {
        accesoriosLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadProducts('accesorios');
        });
    }

    // Modal event listeners
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('product-modal')) {
            closeModal();
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Selección de talla
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedSize = option.dataset.size;
        });
    });

    // Control de cantidad
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                document.getElementById('quantity').textContent = quantity;
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            quantity++;
            document.getElementById('quantity').textContent = quantity;
        });
    }

    // Botón añadir al carrito
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }

    // Evento para el ícono del carrito - IR AL CARRITO
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', goToCart);
        cartIcon.style.cursor = 'pointer';
    }

    // Implementar funcionalidad de búsqueda
    const searchInput = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-bar i');
    
    // Búsqueda al presionar Enter
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
    
    // Búsqueda al hacer clic en el ícono
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            const searchTerm = searchInput ? searchInput.value : prompt('¿Qué estás buscando?');
            if (searchTerm && searchTerm.trim() !== '') {
                performSearch(searchTerm);
            }
        });
    }

    // Mostrar todos los productos al hacer clic en el logo/marca
    const brandName = document.querySelector('.brand-name');
    if (brandName) {
        brandName.addEventListener('click', () => {
            loadProducts();
        });
        brandName.style.cursor = 'pointer';
    }

    // Evento para el ícono de inicio
    const homeIcon = document.querySelector('.home-icon');
    if (homeIcon) {
        homeIcon.addEventListener('click', (e) => {
            e.preventDefault();
            loadProducts();
        });
    }
});

// Función para realizar búsqueda
function performSearch(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return;
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const productContainer = document.getElementById('featured-products');
    productContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productContainer.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1; padding: 40px;">No se encontraron productos que coincidan con tu búsqueda.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='./img/placeholder.jpg'">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price.toFixed(2)}</div>
            </div>
        `;
        
        productCard.addEventListener('click', () => {
            showProductModal(product);
        });
        
        productContainer.appendChild(productCard);
    });
}