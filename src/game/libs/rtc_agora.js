const APP_ID = "c571a826abef48969b21947e67ef2dcf"
const TOKEN = "007eJxTYJg8L4Bvlee2tMCnltrtfP4fLgqeuCoz8ZSy4oKUjLzvatoKDGmpSYZGlibmSZZJpiZJyRaWpqYmKeaJxoZGJskpSalmYUqpyQ2BjAyauz8zMzJAIIjPwpCbmJnHwAAA5v0eDA=="
const CHANNEL = "main"


// let options =
// {
//     // Pass your App ID here.
//     appId: '',
//     // Set the channel name.
//     channel: '',
//     // Pass your temp token here.
//     token: '',
//     // Set the user ID.
//     uid: 0,
// };
let channelParameters =
{
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a local video track.
    localVideoTrack: null,
    // A variable to hold a remote audio track.
    remoteAudioTrack: null,
    // A variable to hold a remote video track.
    remoteVideoTrack: null,
    // A variable to hold the remote user id.s
    remoteUid: null,
};

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)
    

    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks() 

    let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                  </div>`
    // let player = `<article class="comandSlider__item video-container" id="user-container-${UID}">
    //                     <header>
    //                     <p class="comandSlider__item_name"></p>
    //                     </header>
    //                     <div class="comandSlider__item_photo" id="user-${UID}"></div>
    //                 </article>`;
    document.getElementById('videoSlider').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UID}`)
    
    await client.publish([localTracks[0], localTracks[1]])
}

let joinStream = async () => {
    await joinAndDisplayLocalStream()
    // document.getElementById('join-btn').style.display = 'none'
    // document.getElementById('stream-controls').style.display = 'flex'
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user 
    await client.subscribe(user, mediaType)
    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }
        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div> 
                 </div>`

        // player = `<article class="comandSlider__item video-container" id="user-container-${user.uid}">
        //     <header>
        //     <p class="comandSlider__item_name"></p>
        //     </header>
        //     <div class="comandSlider__item_photo" id="user-${user.uid}"></div>
        // </article>`;
        document.getElementById('videoSlider').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for(let i = 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    // document.getElementById('join-btn').style.display = 'block'
    // document.getElementById('stream-controls').style.display = 'none'
    document.getElementById('video-streams').innerHTML = ''
}

let toggleMic = async (e) => {
    if (localTracks[0].muted){
        await localTracks[0].setMuted(false)
        console.log("mic on")
        e.target.src="./assets/images/3d-meeting-space/microphone-2.svg";
        e.target.style.backgroundColor = '#acacff'
    }else{
        await localTracks[0].setMuted(true)
        console.log("mic off")
        e.target.src="./assets/images/3d-meeting-space/microphone-slash.svg";
        e.target.style.backgroundColor = '#EE4B2B'
        // cadetblue
    }
}

let toggleCamera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.src="./assets/images/3d-meeting-space/camera.svg";
        e.target.style.backgroundColor = '#acacff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.src="./assets/images/3d-meeting-space/camera-slash.svg";
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

// document.getElementById('join-btn').addEventListener('click', joinStream)
// document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('mic').addEventListener('click', toggleMic)
document.getElementById('camera').addEventListener('click', toggleCamera)



// Share screen

// AgoraRTC.onAutoplayFailed = () => {
//     // Create button for the user interaction.
//     const btn = document.createElement("button");
//     // Set the button text.
//     btn.innerText = "Click me to resume the audio/video playback";
//     // Remove the button when onClick event occurs.
//     btn.onClick = () => {
//         btn.remove();
//     };
//     // Append the button to the UI.
//     document.body.append(btn);
// }
// var isSharingEnabled = false;
// var isMuteVideo = false;

// document.getElementById('inItScreen').onclick = async function () {
//     if(isSharingEnabled == false) {
//         // Create a screen track for screen sharing.
//         channelParameters.screenTrack = await AgoraRTC.createScreenVideoTrack();
//         // Stop playing the local video track.
//         channelParameters.localVideoTrack.stop();
//         // Unpublish the local video track.
//         await agoraEngine.unpublish(channelParameters.localVideoTrack);
//         // Publish the screen track.
//         await agoraEngine.publish(channelParameters.screenTrack);
//         // Play the screen track on local container.
//         channelParameters.screenTrack.play(localPlayerContainer);
//         // Update the button text.
//         document.getElementById(`inItScreen`).innerHTML = "Stop Sharing";
//         // Update the screen sharing state.
//         isSharingEnabled = true;
//     } else {
//         // Stop playing the screen track.
//         channelParameters.screenTrack.stop();
//         // Unpublish the screen track.
//         await agoraEngine.unpublish(channelParameters.screenTrack);
//         // Publish the local video track.
//         await agoraEngine.publish(channelParameters.localVideoTrack);
//         // Play the local video on the local container.
//         channelParameters.localVideoTrack.play(localPlayerContainer);
//         // Update the button text.
//         document.getElementById(`inItScreen`).innerHTML = "Share Screen";
//         // Update the screen sharing state.
//         isSharingEnabled = false;
//     }
// }

// // Set an event listener on the range slider.
// document.getElementById("localAudioVolume").addEventListener("change", function(evt) {
//     console.log("Volume of local audio :" + evt.target.value);
//     // Set the local audio volume.
//     channelParameters.localAudioTrack.setVolume(parseInt(evt.target.value));
// });
// // Set an event listener on the range slider.
// document.getElementById("remoteAudioVolume").addEventListener("change", function(evt) {
//     console.log("Volume of remote audio :" + evt.target.value);
//     // Set the remote audio volume.
//     channelParameters.remoteAudioTrack.setVolume(parseInt(evt.target.value));
// });

// document.getElementById('muteVideo').onclick = async function () {
//     if(isMuteVideo == false) {
//         // Mute the local video.
//         channelParameters.localVideoTrack.setEnabled(false);
//         // Update the button text.
//         document.getElementById(`muteVideo`).innerHTML = "Unmute Video";
//         isMuteVideo = true;
//     } else {
//         // Unmute the local video.
//         channelParameters.localVideoTrack.setEnabled(true);
//         // Update the button text.
//         document.getElementById(`muteVideo`).innerHTML = "Mute Video";
//         isMuteVideo = false;
//     }
// }

// AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
//     // When plugging in a device, switch to a device that is newly plugged in.
//     if (changedDevice.state === "ACTIVE") {
//         localAudioTrack.setDevice(changedDevice.device.deviceId);
//     // Switch to an existing device when the current device is unplugged.
//     } else if (changedDevice.device.label === localAudioTrack.getTrackLabel()) {
//         const oldMicrophones = await AgoraRTC.getMicrophones();
//         oldMicrophones[0] && localAudioTrack.setDevice(oldMicrophones[0].deviceId);
//     }
// }

// AgoraRTC.onCameraChanged = async (changedDevice) => {
//     // When plugging in a device, switch to a device that is newly plugged in.
//     if (changedDevice.state === "ACTIVE") {
//         localVideoTrack.setDevice(changedDevice.device.deviceId);
//     // Switch to an existing device when the current device is unplugged.
//     } else if (changedDevice.device.label === localVideoTrack.getTrackLabel()) {
//         const oldCameras = await AgoraRTC.getCameras();
//         oldCameras[0] && localVideoTrack.setDevice(oldCameras[0].deviceId);
//     }
// }