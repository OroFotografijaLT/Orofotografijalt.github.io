// Authentication
const username = "admin";
const password = "Technology13";

document.getElementById("login").addEventListener("submit", (e) => {
  e.preventDefault();
  const enteredUsername = document.getElementById("username").value;
  const enteredPassword = document.getElementById("password").value;

  if (enteredUsername === username && enteredPassword === password) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("database").style.display = "block";
    loadCategories();
  } else {
    alert("Invalid credentials!");
  }
});

// Load categories into the first dropdown
function loadCategories() {
  fetch("devices.json")
    .then((response) => response.json())
    .then((data) => {
      const categorySelect = document.getElementById("category-select");
      categorySelect.addEventListener("change", () => loadBrands(data));
    });
}

// Load brands based on selected category
function loadBrands(data) {
  const category = document.getElementById("category-select").value;
  const brands = [...new Set(data.filter(item => item.category === category).map(item => item.brand))];
  const brandSelect = document.getElementById("brand-select");
  
  brandSelect.innerHTML = '<option value="" disabled selected>Select Brand</option>';
  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });

  brandSelect.disabled = false;
  brandSelect.addEventListener("change", () => loadParts(data, category));
}

// Load parts based on selected brand
function loadParts(data, category) {
  const brand = document.getElementById("brand-select").value;
  const devices = data.filter(item => item.category === category && item.brand === brand);
  const partSelect = document.getElementById("part-select");
  
  partSelect.innerHTML = '<option value="" disabled selected>Select Part</option>';
  devices.forEach(device => {
    device.parts.forEach(part => {
      const option = document.createElement("option");
      option.value = JSON.stringify(part);
      option.textContent = `${device.model} - ${part.name}`;
      partSelect.appendChild(option);
    });
  });

  partSelect.disabled = false;
  partSelect.addEventListener("change", () => displayPartDetails(JSON.parse(partSelect.value)));
}

// Display part details
function displayPartDetails(part) {
  const partDetails = document.getElementById("part-details");
  partDetails.innerHTML = `
    <div class="part-card">
      <strong>${part.name}</strong>
      <p>Original Price: ${part.original_price}</p>
      <p>Alternative Price: ${part.alternative_price}</p>
      ${part.warning ? `<p class="warning">${part.warning}</p>` : ""}
    </div>
  `;
}
