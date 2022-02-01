const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
//const canvasElementOver = document.getElementsByClassName('output_canvas_over')[0];
const canvasCtx = canvasElement.getContext('2d');
let x, x_thumb,x_thumb_left, x_POINTER, x_middle, x_ring, x_pinky = null;
let y, y_thumb,y_thumb_left, y_POINTER, y_middle, y_ring, y_pinky = null;
//buffer
let margin = 0.05;

let RightHandIndex =0;
let LeftHandIndex  =1;


let last_x_thumb = 0;
let thumb_play = 0;
let previous_thumb_play,previous_POINTER_play,previous_middle_play = 0;


let last_x_thumb_left = 0;
let thumb_play_left = 0;
let previous_thumb_play_left= 0;

let last_x_POINTER = 0;
let POINTER_play = 0;

let last_x_middle = 0;
let middle_play =0;
console.log(last_x_thumb);


let midiOutput = null;
const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const CONTROL_CHANGE = 0xB0;

const NOTE_DURATION = 300;


const playNote = function (note) {


    note = Math.ceil(rangeWidth(note));
    midiOutput.send([NOTE_ON, note, 0x7f]);
    //midiOutput.send([0xB0,20,note]);
    //midiOutput.send([NOTE_OFF, notes, 0x7f], window.performance.now() + 1000.0);
    //midiOutput.send([CONTROL_CHANGE,thumbsPositionFilter,0x7f]);
}
const playNoteOff = function (note) {
   //midiOutput.send([NOTE_ON, notes, 0x7f]);
    note = Math.ceil(rangeWidth(note));
    midiOutput.send([NOTE_OFF, note, 0x7f], window.performance.now() + 1000.0);

}

const playCC = function (position) {


    position = Math.ceil(rangeWidth(position));

    midiOutput.send([0xB0,20,position]);
    //midiOutput.send([NOTE_OFF, notes, 0x7f], window.performance.now() + 1000.0);
    //midiOutput.send([CONTROL_CHANGE,thumbsPositionFilter,0x7f]);
}

navigator.requestMIDIAccess()
    .then(function (midiAccess) {
        const outputs = midiAccess.outputs.values();
        console.log(outputs);
        for (const output of outputs) {
            console.log(output);
            midiOutput = output;
        }

    });


function rangeWidth(input) {

    if ((input * 105.83) > 127) {
        return 127;

    } else {
        return input * 105.83
    }

}

function drawPointer(x, y) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "6";
    ctx.strokeStyle = "red";
    ctx.arc(x, y, 50, 0, 2 * Math.PI);
    //ctx.rect(x, y, 400, 400);
    ctx.stroke();
}

function onResults(results) {
    //setTimeout(console.log('paue'),400000);
    //sleep(500);

    if (results.multiHandLandmarks.length === 0) {
        // console.log('no hands');
        playNoteOff(previous_thumb_play);
        playNoteOff(previous_middle_play);
        playNoteOff(previous_POINTER_play);
        playNoteOff(previous_thumb_play_left);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {

            RightHand(results.multiHandLandmarks);
            if(results.multiHandLandmarks[1])
            {
                LeftHand(results.multiHandLandmarks);
            }

        }
        canvasCtx.restore();
    }
}


function RightHand(multiHandLandmarks)
{

    x_thumb = multiHandLandmarks[RightHandIndex][4].x;
    y_thumb = multiHandLandmarks[RightHandIndex][4].y;

    if ((x_thumb > (last_x_thumb + margin)) || (x_thumb < (last_x_thumb - margin)) || last_x_thumb === 0) {
        last_x_thumb = x_thumb;

        thumb_play = 1
    }

    x_POINTER = multiHandLandmarks[RightHandIndex][8].x;
    y_POINTER = multiHandLandmarks[RightHandIndex][8].y;


    if ((x_POINTER > last_x_POINTER + margin) || (x_POINTER < last_x_POINTER - margin) || last_x_POINTER === 0) {
        last_x_POINTER = x_POINTER;

        POINTER_play = 1;

    }

    x_middle = multiHandLandmarks[RightHandIndex][12].x;
    y_middle = multiHandLandmarks[RightHandIndex][12].y;


    if ((x_middle > last_x_middle + margin) || (x_middle < last_x_middle - margin) || last_x_middle === 0) {
        last_x_middle = x_middle;

        middle_play = 1;

    }

    /**Play Chenged NOtes **/


    if (thumb_play === 1) {
        thumb_play = 0;

        playNoteOff(previous_thumb_play);

        previous_thumb_play = last_x_thumb;


        playNote(last_x_thumb);
    }
    if (POINTER_play === 1) {

        POINTER_play = 0;
        playNoteOff(previous_POINTER_play);
        previous_POINTER_play = last_x_POINTER;
        playNote(last_x_POINTER);
    }
    if (middle_play === 1) {
        previous_middle_play = last_x_middle;
        playNoteOff(previous_middle_play);
        middle_play = 0;
        playNote(last_x_middle);
    }

    drawPointer(last_x_thumb * 1280, y_thumb * 720);
    drawPointer(last_x_POINTER * 1280, y_POINTER * 720);
    drawPointer(last_x_middle * 1280, y_middle * 720);
}

function LeftHand(multiHandLandmarks)
{

    x_thumb_left = multiHandLandmarks[LeftHandIndex][4].x;
    y_thumb_left = multiHandLandmarks[LeftHandIndex][4].y;

    if ((x_thumb_left > (last_x_thumb_left + margin)) || (x_thumb_left < (last_x_thumb_left - margin)) || last_x_thumb_left === 0) {
        last_x_thumb_left = x_thumb_left;

        thumb_play_left = 1
    }



    /**Play Chenged NOtes **/


    if (thumb_play_left === 1) {
        thumb_play_left = 0;

        playNoteOff(previous_thumb_play_left);

        previous_thumb_play_left = last_x_thumb_left;


        playNote(last_x_thumb_left);
    }


    drawPointer(last_x_thumb_left * 1280, y_thumb_left * 720);

}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});
hands.setOptions({
    selfieMode: true,
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);


const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
