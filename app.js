const audioPlayer = document.getElementById("audioPlayer");
const status = document.getElementById("status");
const canvas = document.getElementById("waveformCanvas");
const ctx = canvas.getContext("2d");
const spectrumImage = document.getElementById("spectrumImage");

canvas.width = 800;
canvas.height = 200;

function playSound(file, label) {
    audioPlayer.src = "audio/" + file;
    audioPlayer.play();

    status.innerText = "Playing: " + label;

    drawWaveform(file);

    // Show spectrum image (only COPD example now)
    if (file === "COPD.wav") {
        spectrumImage.src = "images/COPD_energy_vs_frequency_0_1000Hz.png";
    } else {
        spectrumImage.src = "";
    }
}

function drawWaveform(file) {
    fetch("audio/" + file)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            return audioCtx.decodeAudioData(buffer);
        })
        .then(audioBuffer => {
            const data = audioBuffer.getChannelData(0);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);

            for (let i = 0; i < data.length; i += 100) {
                let x = (i / data.length) * canvas.width;
                let y = (0.5 + data[i] / 2) * canvas.height;
                ctx.lineTo(x, y);
            }

            ctx.stroke();
        });
}