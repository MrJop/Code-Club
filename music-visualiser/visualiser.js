const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioContext;
let analyser;
let dataArray;

// Load audio file
fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    if (!audioContext) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024; // frequency resolution
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        audioContext.decodeAudioData(e.target.result, (buffer) => {
            playAudio(buffer);
        });
    };
    reader.readAsArrayBuffer(file);
});

// Create audio source and connect analyser
function playAudio(buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    source.start();

    animate();
}

// Drawing loop
function animate() {
    requestAnimationFrame(animate);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Example evolving blob
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const radiusBase = 150;
    const radiusVariation = 100;

    ctx.beginPath();
    for (let i = 0; i < dataArray.length; i++) {
        const angle = (i / dataArray.length) * Math.PI * 2;
        const freq = dataArray[i];

        const radius = radiusBase + (freq / 255) * radiusVariation;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.strokeStyle = `hsl(${(performance.now() / 40) % 360}, 80%, 60%)`;
    ctx.lineWidth = 4;
    ctx.stroke();

    let avg = dataArray.reduce((a,b)=>a+b) / dataArray.length;
    let radius = avg * 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fill();

}
