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
    loadDevices();
  } else {
    alert("Invalid credentials!");
  }
});

// Load devices into the dropdown
function loadDevices() {
  fetch("devices.json")
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById("device-select");
      data.forEach((device, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = device.device;
        select.appendChild(option);
      });

      select.addEventListener("change", () => displayParts(data[select.value]));
    });
}

// Display parts for the selected device
function displayParts(device) {
  const partDetails = document.getElementById("part-details");
  partDetails.innerHTML = `<h2>${device.device}</h2>`;
  device.parts.forEach((part) => {
    partDetails.innerHTML += `
      <p><strong>${part.name}</strong></p>
      <p>Original Price: ${part.original_price}</p>
      <p>Alternative Price: ${part.alternative_price}</p>
      <hr>
    `;
  });
}
