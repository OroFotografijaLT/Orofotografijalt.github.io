// Get UI elements
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const connectionStatus = document.getElementById('connection-status');
const confirmationMessage = document.getElementById('confirmation-message');
const healthDashboard = document.getElementById('health-dashboard');
const heartRateDisplay = document.getElementById('heart-rate');
const stepsDisplay = document.getElementById('steps');
const batteryDisplay = document.getElementById('battery-level');

let device, server, confirmed = false;

// Handle Connect Button Click
connectBtn.addEventListener('click', async () => {
  try {
    // Request Bluetooth device
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['heart_rate', 'battery_service', 'step_counter']
    });

    // Connect to GATT Server
    server = await device.gatt.connect();
    connectionStatus.textContent = `Connected to ${device.name}`;
    confirmationMessage.classList.remove('hidden');

    // Wait for watch confirmation (simulate delay)
    setTimeout(() => {
      if (confirm(`Confirm connection to ${device.name} on your watch?`)) {
        confirmed = true;
        confirmationMessage.classList.add('hidden');
        healthDashboard.classList.remove('hidden');
        fetchHealthData();
      } else {
        alert('Connection not confirmed. Disconnecting...');
        disconnect();
      }
    }, 3000);

    // Enable disconnect button
    disconnectBtn.disabled = false;
    connectBtn.disabled = true;

  } catch (error) {
    console.error('Bluetooth error:', error);
    alert('Failed to connect to the smartwatch.');
  }
});

// Handle Disconnect Button Click
disconnectBtn.addEventListener('click', () => {
  disconnect();
});

// Disconnect Logic
function disconnect() {
  if (device && device.gatt.connected) {
    device.gatt.disconnect();
  }
  connectionStatus.textContent = 'Not Connected';
  confirmationMessage.classList.add('hidden');
  healthDashboard.classList.add('hidden');
  connectBtn.disabled = false;
  disconnectBtn.disabled = true;
}

// Fetch Health Data (simulated)
async function fetchHealthData() {
  if (!confirmed) return;

  // Simulate fetching heart rate, steps, and battery level
  heartRateDisplay.textContent = Math.floor(Math.random() * 40) + 60; // Random heart rate
  stepsDisplay.textContent = Math.floor(Math.random() * 10000); // Random steps
  batteryDisplay.textContent = Math.floor(Math.random() * 100); // Random battery level
}
