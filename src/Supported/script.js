

navigator.requestMIDIAccess().then((access) => {
  access.inputs.forEach((device) => {
    device.onmidimessage = (event) => {
      const note = event.data;

    }
  })
})