if (navigator.requestMIDIAccess) {
    window.location.assign("../Supported/Supported.html");
} else {
    window.location.assign("../NotSupported/NotSupported.html");
}