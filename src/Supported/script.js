const MidiKeys = 89;

document.querySelectorAll(".white", ".black").forEach(x => {
  x.style.padding = `5vw ${MidiKeys/100}vw`;
});

const piano = document.getElementById("piano")
const keys = [
    "white", // C
    "black", // C#
    "white", // D
    "black", // D#
    "white", // E
    "white", // F
    "black", // F#
    "white", // G
    "black", // G#
    "white", // A
    "black", // A#
    "white"  // B
];

let i = 0

for (let z = 1; z < MidiKeys+1; z++) {
  const note = document.createElement("button");
  note.id=z
  note.addEventListener("click", () => {
    console.log(note.id)
  })
  
  note.className = keys[i]
  if (i === keys.length-1) {
    i = 0;
  } else {
    i++
  }

  console.log(note)
  piano.appendChild(note);
}

navigator.requestMIDIAccess().then((access) => {
  access.inputs.forEach((device) => {
    device.onmidimessage = (event) => {
      const note = event.data;

    }
  })
})