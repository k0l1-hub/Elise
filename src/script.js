let BPM = 100;
const strength = false;
const MidiKeys = 89;
let currentKeysId = []

const piano = document.getElementById("piano")
piano.style.gridTemplateColumns = `repeat(${MidiKeys}, 1fr)`;
const body = document.body;

body.style.gridTemplateColumns = `repeat(${MidiKeys}, 1fr)`

// Pattern piano

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

let i = 0;

// Make the keys (too many keys in the html would be bad)
function press(note, x=true, event=null) {
  currentKeysId[note][1] = true;
  const line = document.createElement("div");
  const ids = currentKeysId[note][3];
  let a = 0;
  let c = `line${note}`;

  while (ids.includes(c)) {
    a++;
    c = `line${note}-${a}`;
  }

  line.id = c;
  ids.push(c);
  
  line.className = "note";

  if (x) {
    line.style.gridColumn = document.getElementById(note).style.gridColumn;
  } else {
    line.style.gridColumn = `${event.data[1]-22}/${event.data[1]-23}`;
    if (strength) {
      line.style.opacity = event.data[2]/100;
    }
  }
  
  currentKeysId[note][0] = setInterval(() => {
    document.getElementById(currentKeysId[note][3][currentKeysId[note][3].length-1]).style.height = `${currentKeysId[note][2]}vh`; // while pressing
    currentKeysId[note][2]+=0.1;
  }, 3);
  

  
  currentKeysId[note][1] = true;
  body.appendChild(line);
}

function release(note) {
  if (currentKeysId[note][1]) {
    clearInterval(currentKeysId[note][0]);
    currentKeysId[note] = [null, false, 0, currentKeysId[note][3]]
    const l = currentKeysId[note][3];
    const line = document.getElementById(l[l.length-1]);
    
    line.id="";
    l.pop(l.length-1);
    setTimeout(() => {
      line.style.transition = `transform 3s linear`;
      line.style.transform = "translateY(-100vh)";
      console.log("Upclick")
    }, 10);

    setTimeout(() => {
      body.removeChild(line);
    }, 3000);
  }
}

for (let z = 1; z < MidiKeys+1; z++) {
  const note = document.createElement("button");
  note.id=z;
  
  currentKeysId[note.id] = [null, false, 0, ["line"+note.id]];

  note.addEventListener("mousedown", () => press(note.id));

  note.addEventListener("mouseleave", () => release(note.id));

  note.addEventListener("mouseup", () => release(note.id));

// Asign a column because we want this ^^^^^^

  note.className = keys[i];
  note.style.gridColumn = `${z}/${z+1}`;

// White or Black

  if (i === keys.length-1) {
    i = 0;
  } else {
    i++;
  }
  
  piano.appendChild(note);
}


// Detects the midi inputs

navigator.requestMIDIAccess().then((access) => {
  access.inputs.forEach((device) => {
    device.onmidimessage = (event) => {
      if (event.data !== 254) {
        const type = event.data[0] & 0xF0;
        console.log(type);
        
        if (type == 144 && event.data[2] > 0) {
          press(event.data[1]-22, false, event); //some devices play 144 as a command and 0 as the strength o thats the reason of this instead of 144 and 128 only
        } else if (type === 128 || (type === 144 && velocity === 0)){
          release(event.data[1]-22);
        }
        
      }
    }
  })
})

// const line = document.createElement("div");
// line.style.alignSelf = "flex-end";
// line.style.backgroundColor = "orange";
// line.style.height = "100px";
// line.style.gridColumn = `${event.data[1]-22}/${event.data[1]-23}`;
// line.style.gridRow = "1/2";
// line.style.opacity = event.data[2]/100;
// body.appendChild(line);
// setTimeout(() => {
  //   line.style.transition = "all 1.5s";
  //   line.style.transform = "translateY(-100vh)"; // This was more easy ok?
  // }, 100);
  // console.log(event.data);