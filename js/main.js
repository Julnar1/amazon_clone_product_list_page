// Product data
const productData = [
    {
        name: "COOLBABY 2L Purple Straw Bottle",
        price: 353,
        discount: "40% off",
        rating: "4.5 / 5 (1,137)",
        image: "./images/coolbaby_purple_straw_bottle.jpg",
        brand: "COOLBABY",
        category: "Water Bottles"
    },
    {
        name: "2L Motivational Sports Bottle",
        price: 449,
        discount: "M.R.P (46% off)",
        rating: "4.3 / 5 (473)",
        image: "./images/2L_motivational_sports_bottle.jpg",
        brand: "Motivational",
        category: "Sports Bottles"
    },
    {
        name: "kytffu 64oz Glass Water Bottle",
        price: 425,
        discount: "M.R.P (50% off)",
        rating: "4.0 / 5 (2,037)",
        image: "./images/kytffu_64oz_glass_water_bottle.jpg",
        brand: "kytffu",
        category: "Glass Bottles"
    },
    {
        name: "Boldfit 2L Gym Gallon Bottle",
        price: 319,
        discount: "M.R.P (78% off)",
        rating: "4.4 / 5 (85)",
        image: "./images/boldfit_2L_gym_gallon_bottle.jpg",
        brand: "Boldfit",
        category: "Gym Bottles"
    },
    {
        name: "ABM 2L Collapsible Water Bottle",
        price: 499,
        discount: "M.R.P (68% off)",
        rating: "4.5 / 5 (250)",
        image: "./images/abm_2L_collapsible_water_bottle.jpg",
        brand: "ABM",
        category: "Collapsible Bottles"
    },
    {
        name: "BOTTLE BOTTLE 32oz Steel Bottle",
        price: 1650,
        discount: "M.R.P (17% off)",
        rating: "4.5 / 5 (250)",
        image: "./images/bottle_bottle_32oz_steel_bottle.jpg",
        brand: "BOTTLE BOTTLE",
        category: "Steel Bottles"
    },
    {
        name: "BEOLA 550ml Kids Thermos Bottle",
        price: 450,
        discount: "M.R.P 40%",
        rating: "4.4 / 5 (120)",
        image: "./images/beola_550ml_kids_thermos_bottle1.jpg",
        brand: "BEOLA",
        category: "Kids Bottles"
    },
    {
        name: "LA' PRECIOUS 2L Gym Water Bottle",
        price: 375,
        discount: "M.R.P 25%",
        rating: "4.2 / 5 (95)",
        image: "./images/laprecious_2L_gym_water_bottle.jpg",
        brand: "LA' PRECIOUS",
        category: "Gym Bottles"
    },
    {
        name: "Hypertrain 2L Sports Water Bottle",
        price: 400,
        discount: "M.R.P 33%",
        rating: "4.6 / 5 (210)",
        image: "./images/hypertrain_2L_sports_water_bottle.jpg",
        brand: "Hypertrain",
        category: "Sports Bottles"
    },
    {
        name: "2L Collapsible Sport Bottle",
        price: 250,
        discount: "M.R.P 38%",
        rating: "4.0 / 5 (160)",
        image: "./images/2L_collapsible_sport_bottle.jpg",
        brand: "Generic",
        category: "Collapsible Bottles"
    }
];

// DOM Elements
const productContainer = document.getElementById("product-container");
const priceRange = document.getElementById("priceRange");
const currentPrice = document.getElementById("currentPrice");
const sortDropdown = document.getElementById("sortDropdown");
const brandCheckboxes = document.querySelectorAll('input[type="checkbox"]');

// State management
let currentFilters = {
    price: 550,
    brands: [],
    sortBy: 'featured'
};

// Initialize the page
function initializePage() {
    renderProducts(productData);
    setupEventListeners();
    updatePriceDisplay();
}

// Render products based on current filters
function renderProducts(products) {
    productContainer.innerHTML = '';
    
    const filteredProducts = filterProducts(products);
    const sortedProducts = sortProducts(filteredProducts);
    
    sortedProducts.forEach(product => {
        const productCard = createProductCard(product);
        productContainer.innerHTML += productCard;
    });
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4">
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                     onerror="this.src='./images/placeholder.jpg'">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">₹ ${product.price} <span class="discount">${product.discount}</span></p>
                    <p class="card-text"><small>rating: ${product.rating}</small></p>
                    <button class="btn btn-warning" onclick="addToCart('${product.name}')">Add to cart</button>
                </div>
            </div>
        </div>
    `;
}

// Filter products based on current filters
function filterProducts(products) {
    return products.filter(product => {
        const priceMatch = product.price <= currentFilters.price;
        const brandMatch = currentFilters.brands.length === 0 || 
                          currentFilters.brands.includes(product.brand);
        return priceMatch && brandMatch;
    });
}

// Sort products based on current sort option
function sortProducts(products) {
    switch(currentFilters.sortBy) {
        case 'price-low':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...products].sort((a, b) => b.price - a.price);
        case 'rating':
            return [...products].sort((a, b) => {
                const ratingA = parseFloat(a.rating.split('/')[0]);
                const ratingB = parseFloat(b.rating.split('/')[0]);
                return ratingB - ratingA;
            });
        default:
            return products;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Price range filter
    priceRange.addEventListener('input', (e) => {
        currentFilters.price = parseInt(e.target.value);
        updatePriceDisplay();
        renderProducts(productData);
    });

    // Brand filters
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            currentFilters.brands = Array.from(brandCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            renderProducts(productData);
        });
    });

    // Sort dropdown
    sortDropdown.addEventListener('change', (e) => {
        currentFilters.sortBy = e.target.value;
        renderProducts(productData);
    });
}

// Update price display
function updatePriceDisplay() {
    currentPrice.textContent = currentFilters.price;
}

// Shopping cart functionality
let cart = [];

function addToCart(productName) {
    cart.push(productName);
    updateCartCount();
    showNotification(`${productName} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.querySelector('.navCart .fw-bold');
    if (cartCount) {
        cartCount.textContent = `Cart (${cart.length})`;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage); 