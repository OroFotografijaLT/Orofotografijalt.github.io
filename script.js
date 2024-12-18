const connectBtn = document.getElementById('connect-btn');
const unpairBtn = document.getElementById('unpair-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const connectionStatus = document.getElementById('connection-status');
const dashboard = document.getElementById('dashboard');
const firmwareUpload = document.getElementById('firmware-upload');
const uploadFirmwareBtn = document.getElementById('upload-firmware-btn');
const firmwareFileInput = document.getElementById('firmware-file');

let device, server, isConnected = false;

// Connect to the smartwatch
connectBtn.addEventListener('click', async () => {
  try {
    // Allow the user to select a device
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['heart_rate', 'battery_service', 'device_information']
    });

    server = await device.gatt.connect();
    isConnected = true;

    connectionStatus.textContent = `Status: Connected to ${device.name}`;
    dashboard.classList.remove('hidden');
    firmwareUpload.classList.remove('hidden');
    disconnectBtn.disabled = false;
    unpairBtn.disabled = false;
    connectBtn.disabled = true;

    fetchHealthData();
  } catch (error) {
    console.error('Connection failed:', error);
    connectionStatus.textContent = 'Status: Connection Failed';
  }
});

// Disconnect from the smartwatch
disconnectBtn.addEventListener('click', () => {
  if (device && device.gatt.connected) {
    device.gatt.disconnect();
    isConnected = false;
  }
  connectionStatus.textContent = 'Status: Not Connected';
  dashboard.classList.add('hidden');
  firmwareUpload.classList.add('hidden');
  connectBtn.disabled = false;
  disconnectBtn.disabled = true;
});

// Unpair the smartwatch
unpairBtn.addEventListener('click', async () => {
  try {
    const devices = await navigator.bluetooth.getDevices();
    for (const d of devices) {
      if (d.name === device.name) {
        console.log(`Unpairing ${d.name}`);
        await d.gatt.disconnect();
      }
    }
    connectionStatus.textContent = `Status: ${device.name} Unpaired`;
    unpairBtn.disabled = true;
    disconnectBtn.disabled = true;
    connectBtn.disabled = false;
  } catch (error) {
    console.error('Failed to unpair:', error);
    connectionStatus.textContent = 'Status: Unpair Failed';
  }
});

// Fetch health data
async function fetchHealthData() {
  if (!isConnected) return;

  try {
    const heartRateService = await server.getPrimaryService('heart_rate');
    const batteryService = await server.getPrimaryService('battery_service');

    const heartRateChar = await heartRateService.getCharacteristic('heart_rate_measurement');
    const batteryChar = await batteryService.getCharacteristic('battery_level');

    const heartRateValue = await heartRateChar.readValue();
    const batteryValue = await batteryChar.readValue();

    document.getElementById('heart-rate').textContent = heartRateValue.getUint8(0);
    document.getElementById('battery-level').textContent = batteryValue.getUint8(0);
  } catch (error) {
    console.error('Failed to fetch health data:', error);
  }
}

// Firmware upload
uploadFirmwareBtn.addEventListener('click', async () => {
  const file = firmwareFileInput.files[0];
  if (!file) {
    alert('Please select a firmware file.');
    return;
  }
  alert(`Firmware ${file.name} ready for upload!`);
});
