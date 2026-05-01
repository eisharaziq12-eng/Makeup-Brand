// ======================================================
// 1. AUTHENTICATION & PROFILE UI
// ======================================================

// SIGNUP FUNCTION
function signupUser(name, email, password) {
    let users = JSON.parse(localStorage.getItem('allUsers')) || [];
    let exists = users.find(u => u.email === email);
    if(exists) {
        alert("This email is already registered! Please Login.");
        return;
    }
    users.push({ name: name, email: email, password: password });
    localStorage.setItem('allUsers', JSON.stringify(users));
    alert("Account created successfully! ✨ Please login to continue.");
    window.location.href = "login.html";
}

// LOGIN FUNCTION
function loginUser(email, password) {
    let users = JSON.parse(localStorage.getItem('allUsers')) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if(user) {
        alert("Welcome back, " + user.name + "! Login Successful ✨");
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = "index.html"; 
    } else {
        alert("Invalid Email or Password! ❌");
    }
}

// LOGOUT FUNCTION
function logoutUser() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('currentUser');
        alert("You have been logged out.");
        window.location.href = "index.html";
    }
}

// NAVBAR PROFILE UPDATE (New Feature)
function updateNavbarProfile() {
    const authSection = document.getElementById("auth-section");
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && authSection) {
        // Agar user login hai, toh uska Avatar aur Name dikhao
        authSection.innerHTML = `
            <div class="user-profile-nav" onclick="logoutUser()" title="Click to Logout" 
                 style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <img src="https://ui-avatars.com/api/?name=${currentUser.name}&background=d17a8e&color=fff&bold=true" 
                     alt="User Profile" 
                     style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid gold;">
                <span style="color: white; font-size: 14px; font-weight: 600;">${currentUser.name.split(' ')[0]}</span>
            </div>
        `;
    }
}

// ======================================================
// 2. CART SYSTEM (WITH LOGIN PROTECTIONS)
// ======================================================

function addToCart(name, price, image) {
    let currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert("Please login to your account first to add products to the cart! 😊");
        window.location.href = "login.html";
        return; 
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: Number(price), image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(name + " has been added to your cart! ✨");
    if (document.querySelector(".cart-items-section")) displayCart();
}

function displayCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let container = document.querySelector(".cart-items-section");
    if (!container) return;

    container.innerHTML = "<h2>Your Shopping Bag ✨</h2>";
    if (cart.length === 0) {
        container.innerHTML += `<p style="text-align:center;padding:20px;">Your cart is currently empty!</p>`;
        updateTotal();
        return;
    }

    cart.forEach((item, index) => {
        container.innerHTML += `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>Rs. ${item.price}</p>
            </div>
            <div class="quantity-control">
                <button onclick="updateQty(${index}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQty(${index}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
        </div>`;
    });
    updateTotal();
}

function updateQty(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function updateTotal() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    let shipping = cart.length > 0 ? 200 : 0;

    if(document.getElementById("subtotal")) document.getElementById("subtotal").innerText = "Rs. " + subtotal;
    if(document.getElementById("shipping")) document.getElementById("shipping").innerText = "Rs. " + shipping;
    if(document.getElementById("grand-total")) document.getElementById("grand-total").innerText = "Rs. " + (subtotal + shipping);
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!localStorage.getItem('currentUser')) {
        alert("You must be logged in to proceed to checkout.");
        window.location.href = "login.html";
        return;
    }
    if (cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }
    alert("Thank you! Your order has been placed successfully. ✨");
    localStorage.removeItem("cart");
    displayCart();
}

// ======================================================
// 3. SEARCH & UI INTERACTION
// ======================================================

function searchProduct() {
    let input = document.getElementById('searchInput').value.toLowerCase().trim();
    if (input === "") { alert("Please enter a product name! 😊"); return; }

    if (input.includes("lipstick") || input.includes("lip")) window.location.href = "lipstick.html";
    else if (input.includes("foundation") || input.includes("base")) window.location.href = "foundation.html";
    else if (input.includes("eyeshadow") || input.includes("palette")) window.location.href = "eyeshadow.html";
    else alert("Sorry! '" + input + "' not found. Try 'lipstick' or 'foundation'.");
}

function toggleDetails(id) {
    let box = document.getElementById(id);
    if(box) box.style.display = (box.style.display === "block") ? "none" : "block";
}

// Wishlist Logic
const likeIcon = document.getElementById("likeIcon");
if(likeIcon) {
    likeIcon.addEventListener("click", () => {
        likeIcon.classList.toggle("liked");
        likeIcon.textContent = likeIcon.classList.contains("liked") ? "♥" : "♡";
    });
}

// Initial Load
window.addEventListener("DOMContentLoaded", () => {
    displayCart();
    updateNavbarProfile(); // Yeh function navbar ko update karega
});