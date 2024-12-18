document.getElementById('connect-btn').addEventListener('click', async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service', 'device_information']
    });

    console.log('Connected to:', device.name);
    alert(`Connected to ${device.name}`);

    document.getElementById('upload-firmware-btn').disabled = false;
    document.getElementById('firmware-file').disabled = false;

  } catch (error) {
    console.error('Bluetooth error:', error);
    alert('Failed to connect to the smartwatch.');
  }
});

document.getElementById('upload-firmware-btn').addEventListener('click', async () => {
  const fileInput = document.getElementById('firmware-file');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a firmware file first!');
    return;
  }

  try {
    const data = await file.arrayBuffer();
    console.log('Firmware size:', data.byteLength);

    alert('Firmware ready to send! (Further implementation required)');

  } catch (error) {
    console.error('Upload failed:', error);
    alert('Failed to upload firmware.');
  }
});
