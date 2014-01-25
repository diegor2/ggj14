
var gamePad = new Gamepad();

gamePad.bind(Gamepad.Event.CONNECTED, function(device) {
    console.log('Gamepad - Connected', device);
});

gamePad.bind(Gamepad.Event.DISCONNECTED, function(device) {
    console.log('Gamepad - Disconnected', device);
});

if (gamePad.init()) {
    console.log("Gamepad - Init");
}