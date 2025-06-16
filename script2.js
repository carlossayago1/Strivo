
        // Variables globales
        let cart = [];
        let selectedPaymentMethod = 'credit';

        // Cargar datos del carrito desde localStorage o memoria
        function loadCart() {
            // Simulamos obtener el carrito de la página principal
            // En una implementación real, esto vendría de localStorage o una API
            const savedCart = localStorage.getItem('strivoCart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
            } else {
                // Carrito de ejemplo si no hay datos
                cart = [
                    {
                        id: 1,
                        name: "Forum adidas",
                        price: 89.99,
                        size: "9",
                        quantity: 1,
                        image: "/img/zapas1.webp"
                    },
                    {
                        id: 2,
                        name: "Campus adidas",
                        price: 79.99,
                        size: "8.5",
                        quantity: 2,
                        image: "/img/zapas2.webp"
                    }
                ];
            }
            
            displayCartItems();
            updateOrderSummary();
        }

        // Mostrar items del carrito
        function displayCartItems() {
            const cartContainer = document.getElementById('cart-items');
            
            if (cart.length === 0) {
                cartContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <h2>Tu carrito está vacío</h2>
                        <p>Añade algunos productos para continuar</p>
                    </div>
                `;
                return;
            }

            cartContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VuPC90ZXh0Pgo8L3N2Zz4='">
                    </div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-size">Talla: ${item.size}</div>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="item-controls">
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, '${item.size}', -1)">-</button>
                            <div class="qty-display">${item.quantity}</div>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, '${item.size}', 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeItem(${item.id}, '${item.size}')">
                            <i class="fas fa-trash"></i>
                            Eliminar
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Actualizar cantidad
        function updateQuantity(id, size, change) {
            const itemIndex = cart.findIndex(item => item.id === id && item.size === size);
            if (itemIndex > -1) {
                cart[itemIndex].quantity += change;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                }
                displayCartItems();
                updateOrderSummary();
                saveCart();
            }
        }

        // Eliminar item
        function removeItem(id, size) {
            cart = cart.filter(item => !(item.id === id && item.size === size));
            displayCartItems();
            updateOrderSummary();
            saveCart();
        }

        // Actualizar resumen del pedido
        function updateOrderSummary() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = cart.length > 0 ? 15.00 : 0;
            const taxes = subtotal * 0.19; // 19% IVA
            const total = subtotal + shipping + taxes;

            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
            document.getElementById('taxes').textContent = `$${taxes.toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;

            // Deshabilitar checkout si el carrito está vacío
            document.getElementById('checkout-btn').disabled = cart.length === 0;
        }

        // Guardar carrito
        function saveCart() {
            localStorage.setItem('strivoCart', JSON.stringify(cart));
        }

        // Manejar métodos de pago
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', function() {
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
                this.classList.add('selected');
                selectedPaymentMethod = this.dataset.method;
                
                // Ocultar todos los formularios
                document.getElementById('credit-form').style.display = 'none';
                document.getElementById('paypal-form').style.display = 'none';
                document.getElementById('efecty-form').style.display = 'none';
                
                // Mostrar el formulario correspondiente
                document.getElementById(selectedPaymentMethod + '-form').style.display = 'block';
            });
        });

        // Formatear número de tarjeta
        document.getElementById('card-number')?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.replace(/(.{4})/g, '$1 ');
            if (formattedValue.endsWith(' ')) {
                formattedValue = formattedValue.slice(0, -1);
            }
            e.target.value = formattedValue;
        });

        // Formatear fecha de vencimiento
        document.getElementById('expiry')?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        // Procesar pago
        function processPayment() {
            // Validar formulario
            if (!validateForm()) {
                return;
            }

            // Mostrar loading
            document.getElementById('loading').style.display = 'block';
            document.getElementById('checkout-btn').disabled = true;

            // Simular procesamiento de pago
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('checkout-btn').disabled = false;
                
                // Generar número de orden
                const orderNumber = 'STR-' + Date.now().toString().slice(-8);
                document.getElementById('order-number').textContent = orderNumber;
                
                // Mostrar modal de éxito
                document.getElementById('success-modal').style.display = 'block';
                
                // Limpiar carrito
                cart = [];
                saveCart();
                displayCartItems();
                updateOrderSummary();
            }, 3000);
        }

        // Validar formulario
        function validateForm() {
            const requiredFields = {
                'credit': ['card-number', 'expiry', 'cvv', 'card-holder'],
                'paypal': ['paypal-email'],
                'efecty': ['document-number', 'phone']
            };

            const fields = requiredFields[selectedPaymentMethod];
            
            for (let fieldId of fields) {
                const field = document.getElementById(fieldId);
                if (!field || !field.value.trim()) {
                    field?.focus();
                    alert('Por favor completa todos los campos requeridos');
                    return false;
                }
            }

            // Validaciones específicas
            if (selectedPaymentMethod === 'credit') {
                const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
                if (cardNumber.length < 13) {
                    alert('Número de tarjeta inválido');
                    return false;
                }
                
                const cvv = document.getElementById('cvv').value;
                if (cvv.length < 3) {
                    alert('CVV inválido');
                    return false;
                }
            }

            return true;
        }

        // Navegación
        function goBack() {
            window.history.back();
        }

        function goHome() {
            window.location.href = 'index.html';
        }

        function continueShopping() {
            document.getElementById('success-modal').style.display = 'none';
            window.location.href = 'index.html';
        }

        // Inicializar página
        document.addEventListener('DOMContentLoaded', function() {
            loadCart();
        });

        // Cerrar modal al hacer clic fuera
        document.getElementById('success-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                continueShopping();
            }
        });