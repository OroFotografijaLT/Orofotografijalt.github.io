// Cookie consent management
document.getElementById('accept-cookies').addEventListener('click', () => {
  document.getElementById('cookie-banner').style.display = 'none';
  localStorage.setItem('cookies-accepted', 'true');
});

document.getElementById('decline-cookies').addEventListener('click', () => {
  document.getElementById('cookie-banner').style.display = 'none';
});

if (localStorage.getItem('cookies-accepted')) {
  document.getElementById('cookie-banner').style.display = 'none';
}

// Shopping Cart functionality
let cart = [];

function updateCart() {
  let cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    let itemElement = document.createElement('div');
    itemElement.innerHTML = `
      <p>${item.name} - €${item.price} x ${item.quantity}</p>
      <button onclick="removeFromCart('${item.name}')">Remove</button>
    `;
    cartItems.appendChild(itemElement);
    total += item.price * item.quantity;
  });

  document.getElementById('cart-icon').innerText = `Cart (${cart.length}) - €${total.toFixed(2)}`;
}

function addToCart(productName, productPrice) {
  const existingProduct = cart.find(item => item.name === productName);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ name: productName, price: parseFloat(productPrice), quantity: 1 });
  }
  updateCart();
}

function removeFromCart(productName) {
  cart = cart.filter(item => item.name !== productName);
  updateCart();
}

// Handle form submission
document.getElementById('cart-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Order submitted!');
  cart = [];
  updateCart();
});

// Event listeners for add-to-cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    addToCart(button.getAttribute('data-product'), button.getAttribute('data-price'));
  });
});

// Show Cart Modal
document.getElementById('cart-icon').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'block';
});

</script>
