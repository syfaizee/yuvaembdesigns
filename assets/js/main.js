// Yuva Embroidery Service - Main JavaScript
// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartCount').style.display = count > 0 ? 'block' : 'none';
}

// Add to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showNotification('Product added to cart!');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showNotification('Product removed from cart!');
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted text-center">Your cart is empty</p>';
        cartTotal.textContent = 'Rs 0';
        checkoutBtn.disabled = true;
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">Rs ${item.price} x ${item.quantity}</small>
                </div>
                <div class="text-end">
                    <div class="fw-bold mb-1">Rs ${itemTotal}</div>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `Rs ${total}`;
    checkoutBtn.disabled = false;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Search functionality
document.getElementById('searchBtn')?.addEventListener('click', performSearch);
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('searchResults');
    
    // Sample products data
    const products = [
        { id: 1, name: 'Floral Pattern Design', price: 450, collection: 'rs450' },
        { id: 2, name: 'Mirror Work Embroidery', price: 550, collection: 'mirror' },
        { id: 3, name: 'Line Design Pattern', price: 350, collection: 'lines' },
        { id: 4, name: 'Kutch Work Design', price: 600, collection: 'kutch' },
        { id: 5, name: 'Net Design Embroidery', price: 450, collection: 'net' },
    ];
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.collection.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<p class="text-muted">No products found</p>';
        return;
    }
    
    resultsDiv.innerHTML = filtered.map(product => `
        <div class="d-flex justify-content-between align-items-center p-2 border-bottom">
            <div>
                <h6 class="mb-0">${product.name}</h6>
                <small class="text-muted">Rs ${product.price}</small>
            </div>
            <button class="btn btn-sm btn-primary" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Login/Register forms
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Login functionality - Coming soon!');
});

document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Registration functionality - Coming soon!');
});

// Checkout
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) return;
    showNotification('Redirecting to checkout...');
    // In a real app, redirect to checkout page
});

// Load featured products
function loadFeaturedProducts() {
    const products = [
        { id: 1, name: 'Elegant Floral Design', price: 450, image: 'collection-image' },
        { id: 2, name: 'Mirror Work Collection', price: 550, image: 'collection-image-3' },
        { id: 3, name: 'Line Pattern Design', price: 350, image: 'collection-image-4' },
        { id: 4, name: 'Kutch Work Pattern', price: 600, image: 'collection-image-8' },
    ];
    
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="product-card h-100">
                <div class="product-image ${product.image}">
                    <div class="product-overlay">
                        <button class="btn btn-light" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            Add to Cart
                        </button>
                    </div>
                </div>
                <div class="product-info p-4">
                    <h5 class="fw-bold">${product.name}</h5>
                    <p class="text-primary fw-bold mb-0">Rs ${product.price}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
    loadFeaturedProducts();
    
    // Auto-rotate carousel
    const carousel = document.querySelector('#mainCarousel');
    if (carousel) {
        setInterval(() => {
            const bsCarousel = bootstrap.Carousel.getInstance(carousel);
            if (bsCarousel) bsCarousel.next();
        }, 5000);
    }
});

// Collection filtering
const urlParams = new URLSearchParams(window.location.search);
const collection = urlParams.get('collection');
if (collection) {
    document.addEventListener('DOMContentLoaded', () => {
        filterByCollection(collection);
    });
}

function filterByCollection(collectionName) {
    // This would filter products on products page
    console.log('Filtering by collection:', collectionName);
}

