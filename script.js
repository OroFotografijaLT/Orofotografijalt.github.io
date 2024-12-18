const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const connectionStatus = document.getElementById('connection-status');
const healthDashboard = document.getElementById('health-dashboard');
const firmwareSection = document.getElementById('firmware-section');
const settingsSection = document.getElementById('settings-section');
const uploadFirmwareBtn = document.getElementById('upload-firmware-btn');
const firmwareFileInput = document.getElementById('firmware-file');

let device, server, healthService, batteryService, isConnected = false;

// Connect to the smartwatch
connectBtn.addEventListener('click', async () => {
  try {
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['heart_rate', 'battery_service', 'step_counter']
    });

    server = await device.gatt.connect();
    isConnected = true;

    // Update status
    connectionStatus.textContent = `Connected to ${device.name}`;
    healthDashboard.classList.remove('hidden');
    firmwareSection.classList.remove('hidden');
    settingsSection.classList.remove('hidden');
    disconnectBtn.disabled = false;
    connectBtn.disabled = true;

    // Confirm connection from the watch
    alert('Please confirm the connection on your smartwatch.');
    fetchHealthData();
  } catch (error) {
    console.error(error);
    alert('Failed to connect. Please try again.');
  }
});

// Disconnect from the smartwatch
disconnectBtn.addEventListener('click', () => {
  if (device && device.gatt.connected) {
    device.gatt.disconnect();
    isConnected = false;
  }
  connectionStatus.textContent = 'Not Connected';
  healthDashboard.classList.add('hidden');
  firmwareSection.classList.add('hidden');
  settingsSection.classList.add('hidden');
  connectBtn.disabled = false;
  disconnectBtn.disabled = true;
});

// Fetch health data
async function fetchHealthData() {
  if (!isConnected) return;

  try {
    healthService = await server.getPrimaryService('heart_rate');
    batteryService = await server.getPrimaryService('battery_service');

    const heartRateChar = await healthService.getCharacteristic('heart_rate_measurement');
    const batteryChar = await batteryService.getCharacteristic('battery_level');

    const heartRateValue = await heartRateChar.readValue();
    const batteryValue = await batteryChar.readValue();

    document.getElementById('heart-rate').textContent = heartRateValue.getUint8(0);
    document.getElementById('battery-level').textContent = batteryValue.getUint8(0);
  } catch (error) {
    console.error('Failed to fetch health data:', error);
  }
}

// Upload firmware
uploadFirmwareBtn.addEventListener('click', async () => {
  const file = firmwareFileInput.files[0];
  if (!file) {
    alert('Please select a firmware file.');
    return;
  }

  alert(`Firmware ${file.name} ready for upload!`);
});

// Save settings
document.getElementById('save-settings-btn').addEventListener('click', () => {
  const brightness = document.getElementById('brightness').value;
  alert(`Saved brightness: ${brightness}%`);
});
