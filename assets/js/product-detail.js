// Product Detail Page JavaScript

// Image Zoom Lens Feature
let lens, result, mainImg;
let zoom = 2; // Zoom level

function initImageZoom() {
    mainImg = document.getElementById('mainProductImage');
    lens = document.getElementById('zoomLens');
    result = document.getElementById('zoomResult');
    
    if (!mainImg || !lens || !result) return;
    
    // Set zoom result background image
    result.style.backgroundImage = `url('${mainImg.src}')`;
    result.style.backgroundSize = `${mainImg.width * zoom}px ${mainImg.height * zoom}px`;
    
    // Lens event listeners
    mainImg.addEventListener('mousemove', moveLens);
    mainImg.addEventListener('mouseenter', showZoom);
    mainImg.addEventListener('mouseleave', hideZoom);
    mainImg.addEventListener('touchstart', touchZoom);
    mainImg.addEventListener('touchmove', touchZoom);
    mainImg.addEventListener('touchend', hideZoom);
}

function showZoom() {
    lens.style.display = 'block';
    result.classList.add('active');
}

function hideZoom() {
    lens.style.display = 'none';
    result.classList.remove('active');
}

function moveLens(e) {
    e.preventDefault();
    
    const pos = getCursorPos(e);
    let x = pos.x - (lens.offsetWidth / 2);
    let y = pos.y - (lens.offsetHeight / 2);
    
    // Prevent lens from going outside image
    const imgRect = mainImg.getBoundingClientRect();
    const maxX = imgRect.width - lens.offsetWidth;
    const maxY = imgRect.height - lens.offsetHeight;
    
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    
    lens.style.left = x + 'px';
    lens.style.top = y + 'px';
    
    // Calculate zoom result position
    const fx = result.offsetWidth / lens.offsetWidth;
    const fy = result.offsetHeight / lens.offsetHeight;
    
    result.style.backgroundPosition = `-${x * fx}px -${y * fy}px`;
}

function getCursorPos(e) {
    const imgRect = mainImg.getBoundingClientRect();
    return {
        x: e.pageX - imgRect.left - window.scrollX,
        y: e.pageY - imgRect.top - window.scrollY
    };
}

// Touch zoom for mobile
function touchZoom(e) {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const fakeEvent = {
            pageX: touch.pageX,
            pageY: touch.pageY,
            preventDefault: () => {}
        };
        showZoom();
        moveLens(fakeEvent);
    }
}

// Change main image when thumbnail is clicked
function changeMainImage(src) {
    const mainImg = document.getElementById('mainProductImage');
    if (mainImg) {
        mainImg.src = src;
        // Update zoom result background
        const result = document.getElementById('zoomResult');
        if (result) {
            result.style.backgroundImage = `url('${src}')`;
        }
        // Update active thumbnail
        document.querySelectorAll('.thumbnail-image').forEach(img => {
            img.classList.remove('active');
        });
        event.target.classList.add('active');
    }
}

// Quantity controls
function increaseQuantity() {
    const qtyInput = document.getElementById('quantity');
    const currentValue = parseInt(qtyInput.value);
    const maxValue = parseInt(qtyInput.max);
    if (currentValue < maxValue) {
        qtyInput.value = currentValue + 1;
    }
}

function decreaseQuantity() {
    const qtyInput = document.getElementById('quantity');
    const currentValue = parseInt(qtyInput.value);
    const minValue = parseInt(qtyInput.min);
    if (currentValue > minValue) {
        qtyInput.value = currentValue - 1;
    }
}

// Add to cart from product detail
function addToCartFromDetail() {
    const product = {
        id: Date.now(),
        name: document.querySelector('.product-title').textContent,
        price: 450, // Get from product price
        quantity: parseInt(document.getElementById('quantity').value),
        size: document.querySelector('input[name="size"]:checked')?.value || 'small',
        image: document.getElementById('mainProductImage').src
    };
    
    if (typeof addToCart === 'function') {
        addToCart(product);
    } else {
        // Fallback if main.js not loaded
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id && item.size === product.size);
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('Product added to cart!');
    }
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initImageZoom();
    
    // Update cart count
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    } else {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) {
            cartCountEl.textContent = count;
            cartCountEl.style.display = count > 0 ? 'block' : 'none';
        }
    }
    
    // Prevent quantity input from going below min or above max
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        qtyInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            if (value < min) this.value = min;
            if (value > max) this.value = max;
        });
    }
});

// Handle window resize for zoom
window.addEventListener('resize', () => {
    if (mainImg && result) {
        result.style.backgroundSize = `${mainImg.width * zoom}px ${mainImg.height * zoom}px`;
    }
});

