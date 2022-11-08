// const APP_ID = "c571a826abef48969b21947e67ef2dcf"
const APP_ID = "f1e5deb0b0634f0cafe5c19df9e61e5b"

const TOKEN = "007eJxTYPC0aT+72zU/KsJ8sYTJr+uft9fpxepHhc83XvKmXKPHb7MCQ5phqmlKapJBkoGZsUmaQXJiWqppsqFlSpplqhlQKmnryozkhkBGBr0dXoyMDBAI4rMw5CZm5jEwAABIvB+r"
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
    remoteScreens: {},
    // A variable to hold the remote user id.s
    remoteUid: null,
};

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

const screenShareClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)
    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    let username = localStorage.getItem("name")

    let intials = username.charAt(0)


    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="video-player" id="user-${UID}"></div>
                    <div class="profileImage" id="initial-${UID}">` + intials + `</div>

                    <span class="member-name">`+ username + `</span>
                </div>`;

    document.getElementById('videoSlider').insertAdjacentHTML('beforeend', player)

    let player_name = `<div class="info-item" id="member-${UID}">
                        <img class="member-pic" src="./assets/images/3d-meeting-space/dummy-dp.svg" alt="member-pic" />
                        <span class="member-name">`+ username + `</span>
                    </div>`;
    document.getElementById('member-data').insertAdjacentHTML('beforeend', player_name)

    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0], localTracks[1]])
}

let joinStream = async () => {
    await joinAndDisplayLocalStream()
}

let handleUserJoined = async (user, mediaType) => {
    user.name = localStorage.getItem("name")
    var intials = user.name.charAt(0)

    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)
    if (mediaType === 'video') {
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null) {
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                    <div class="video-player" id="user-${user.uid}"></div> 
                    <div class="profileImage"id="initial-${user.uid}">` + intials + `</div>
                    <span class="member-name">`+ user.name + `</span>
                </div>`;

        document.getElementById('videoSlider').insertAdjacentHTML('beforeend', player)


        let player_name = `<div class="info-item" id="member-${user.uid}">
                        <img class="member-pic" src="./assets/images/3d-meeting-space/dummy-dp.svg" alt="member-pic" />
                        <span class="member-name">`+ user.name + `</span>
                    </div>`;
        document.getElementById('member-data').insertAdjacentHTML('beforeend', player_name)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio') {
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
    document.getElementById(`member-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for (let i = 0; localTracks.length > i; i++) {
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('videoSlider').innerHTML = ''
    window.location.href = "/dashboard/";
}

let toggleMic = async (e) => {
    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false)
        console.log("mic on")
        e.target.src = "./assets/images/3d-meeting-space/microphone-2.svg";
        e.target.style.backgroundColor = '#acacff'
    } else {
        await localTracks[0].setMuted(true)
        console.log("mic off")
        e.target.src = "./assets/images/3d-meeting-space/microphone-slash.svg";
        e.target.style.backgroundColor = '#EE4B2B'
        // cadetblue
    }
}

let toggleCamera = async (e) => {
    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false)
        e.target.src = "./assets/images/3d-meeting-space/camera.svg";
        e.target.style.backgroundColor = '#acacff'
        // $('#profileImage').css('zIndex', '60');

    } else {
        await localTracks[1].setMuted(true)
        e.target.src = "./assets/images/3d-meeting-space/camera-slash.svg";
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
var isSharingEnabled = false;
// var isMuteVideo = false;

document.getElementById('reference-material-test').onclick = async function () {
    if (isSharingEnabled == false) {
        $("#material-view-container").removeClass('d-none');
        
        // screenShareClient.on('screen-published', handleScreenPublished)
        // screenShareClient.on('screen-unpublished', handleScreenUnpublished)
        // await screenShareClient.join(APP_ID, CHANNEL, TOKEN, null)

        // Create a screen track for screen sharing.
        channelParameters.screenTrack = await AgoraRTC.createScreenVideoTrack();
        // Stop playing the local video track.
        localTracks[1].stop();
        // Unpublish the local video track.
        await client.unpublish(localTracks[1]);
        // Publish the screen track.
        await client.publish(channelParameters.screenTrack);
        // Play the screen track on local container.
        channelParameters.screenTrack.play('material-view-container');
        // Update the button text.
        // document.getElementById(`reference-material-test`).innerHTML = "Stop Sharing";
        // Update the screen sharing state.
        isSharingEnabled = true;
    } else {
        // Stop playing the screen track.
        channelParameters.screenTrack.stop();
        // Unpublish the screen track.
        await client.unpublish(channelParameters.screenTrack);
        // Publish the local video track.
        await client.publish(localTracks[1]);
        // Play the local video on the local container.
        // channelParameters.localVideoTrack.play('material-view-container');
        // Update the button text.
        // document.getElementById(`reference-material-test`).innerHTML = "Share Screen";
        // Update the screen sharing state.
        isSharingEnabled = false;
    }
}

async function stopSharing(){
    channelParameters.screenTrack.stop();
    await client.unpublish(channelParameters.screenTrack);
    await client.publish(localTracks[1]);
    isSharingEnabled = false;
}

// let handleScreenPublished = async (screen, mediaType) => {
//     channelParameters.remoteScreens[screen.uid] = screen
//     await client.subscribe(screen, mediaType)
//     if (mediaType === 'video') {
//         // let player = document.getElementById(`screen-container-${screen.uid}`)
//         // if (player != null) {
//         //     player.remove()
//         // }
//         $("#material-view-container").removeClass('d-none');
//         screen.videoTrack.play('material-view-container')
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