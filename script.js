navigator.requestMIDIAccess().then((access) => {
  console.log(access);
  access.inputs.forEach((device) => {
    device.onmidimessage = (event) => {
      console.log(event);
    }
  })
})