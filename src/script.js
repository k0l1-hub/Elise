const MidiKeys = 88; 
const OFFSET = 20;

let synth = new Tone.PolySynth(Tone.Synth).toDestination();
const strength = true;
let currentKeysId = []

const instruments = {
  "Piano": () => new Tone.Sampler({
    urls: { C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", A4: "A4.mp3" },
    baseUrl: "https://tonejs.github.io/audio/salamander/",
    release: 1
  }),

  "Casio": () => new Tone.Sampler({
    urls: { A1: "A1.mp3", A2: "A2.mp3" },
    baseUrl: "https://tonejs.github.io/audio/casio/",
    release: 1
  }),
};

synth = instruments["Piano"]().toDestination();

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

  
  async function play(noteOrEvent, pressure=false, midi=false) {
    if (pressure) {
      synth.triggerAttack(Tone.Frequency(noteOrEvent.data[1], "midi").toNote(), Tone.now(), noteOrEvent.data[2] / 127);
    } else {
      if (midi) {
        synth.triggerAttack(Tone.Frequency(noteOrEvent, "midi").toNote(), Tone.now());
      } else {
        synth.triggerAttack(Tone.Frequency(noteOrEvent+OFFSET, "midi").toNote(), Tone.now());
      }
    }
  };

  async function releaseNote(note, midi=true) {
    if (midi) {
      synth.triggerRelease(Tone.Frequency(note, "midi").toNote());
    } else {
      synth.triggerRelease(Tone.Frequency(note+OFFSET, "midi").toNote());
    }
  }

function press(note, event=null) {
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
    
    if (!event) {
      line.style.gridColumn = document.getElementById(note).style.gridColumn;
      play(Number(note))
    } else {
      line.style.gridColumn = `${event.data[1]-OFFSET-1}/${event.data[1]-OFFSET}`;
      if (strength) {
        line.style.opacity = event.data[2]/100;
        play(event, true, true)
      } else {
        play(event, midi = true)
      }
      
    }
    
    currentKeysId[note][0] = setInterval(() => {
      document.getElementById(currentKeysId[note][3][currentKeysId[note][3].length-1]).style.height = `${currentKeysId[note][2]}vh`; // while pressing
      currentKeysId[note][2]+=0.1;
    }, 3);
    
    
    
    currentKeysId[note][1] = true;
    body.appendChild(line);
}

function release(note, midi = false) {
  if (currentKeysId[note][1]) {
    clearInterval(currentKeysId[note][0]);
    currentKeysId[note] = [null, false, 0, currentKeysId[note][3]]
    const l = currentKeysId[note][3];
    const line = document.getElementById(l[l.length-1]);
    
    line.id="";
    l.pop();
    setTimeout(() => {
      line.style.transition = `transform 3s linear`;
      line.style.transform = "translateY(-100vh)";
      console.log("Upclick")
    }, 10);
    
    setTimeout(() => {
      body.removeChild(line);
    }, 3000);

    releaseNote(note, midi);
  }
}

let i = 9;
// Make the keys (too many keys in the html would be bad)
for (let z = 1; z < MidiKeys+1; z++) {
  const note = document.createElement("button");
  note.id=z;
  
  currentKeysId[note.id] = [null, false, 0, ["line"+note.id]];
  
  note.addEventListener("mousedown", (event) => event.button===0? press(note.id) : () => {});

  note.addEventListener("mouseleave", () => release(note.id));

  note.addEventListener("mouseup", (event) => event.button===0? release(Number(note.id)) : () => {});

  note.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  })
  
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

let ready = false
// Detects the midi inputs

navigator.requestMIDIAccess().then((access) => {
  access.inputs.forEach((device) => {
    device.onmidimessage = (event) => {
      if (event.data[0] !== 254) {
        const type = event.data[0] & 0xF0;
        console.log(type);
        if (!ready) {
          ready = true
          body.innerHTML += "<h1 id='notice' style='position: fixed;right: 10vw; top: 10vw; '>Click the page for sound</h1>"
        }

        if (type == 144 && event.data[2] > 0) {
          press(event.data[1]-OFFSET, event); //some devices play 144 as a command and 0 as the strength o thats the reason of this instead of 144 and 128 only

        } else if (type === 128 || (type === 144 && event.data[2] === 0)){
          release(event.data[1]-OFFSET, true);

        }
        
      }
    }
  })
})


const exit = document.getElementById("exit");
const box = document.getElementById("box");

const back = document.createElement("button");
back.innerText = "Box Back";
back.className = "exit";
back.style.display = "none";
body.appendChild(back);

const Metronome = document.getElementById("MetronomeImg");

exit.addEventListener("click", () => {
  box.style.opacity = "0";

  setTimeout(() => {
    box.style.display = "none";
  }, 500)

  back.style.opacity = "1";
  
  setTimeout(() => {
    back.style.display = "block";
  }, 100);
})

back.addEventListener("click", () => {
  back.style.opacity = "0";
  
  setTimeout(() => {
    back.style.display = "none";
  }, 500)
  
  box.style.display = "block";
  
  setTimeout(() => {
    box.style.opacity = "1";
  }, 100)
})

// let BPM = 120;
// let signature = "4/4";
// let active = false;
// let MetronomeInterval = null;

// Metronome.addEventListener("click", () => {
  
//   if (!active) {
//     BPM = window.prompt("Please, give the BPM:");
//     if (!BPM) {
//       BPM = 120;
//     }


//     const sound1 = new Audio('../assets/metronome01.ogg');
    
//     function playSound(sound) {
//       sound.currentTime = 0;
//       sound.play()
//     }

//     playSound(sound1);
//     MetronomeInterval = setInterval(() => {
//       if (!active) {
//         playSound(sound1);
//       }
//     }, 60000 / BPM)

//   }
// })

// Later

const instru = document.getElementById("instrument");


for (const [key, value] of Object.entries(instruments)) {
  const instrumentOption = document.createElement("option");
  instrumentOption.value = key;
  instrumentOption.textContent = key;
  instru.appendChild(instrumentOption);
}


instru.addEventListener("change", () => {
  synth = instruments[instru.value]().toDestination();
})



document.addEventListener("click", () => {
  synth.releaseAll();
  document.getElementById("notice").remove();
}, { once: true })