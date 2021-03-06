
// const modeBtn = document.querySelector('#mode');


let client = AgoraRTC.createClient({mode: 'rtc', 'codec':"vp8"})


let config = {
    appid:'2d1c6d301acc41f7a66242659650608a',
    token:'0062d1c6d301acc41f7a66242659650608aIAAb0ZcITnwnpyc7XM5nO3p+fKPNW2LeevtFZLTjhQXwlZ1fCyoAAAAAEACKbcvBQWJgYgEAAQBAYmBi',
    uid:null,
    channel: 'livestream'

}

let   localTracks = {
    audioTrack:null,
    videoTrack:null,
}

let localTrackState =  {
    audioTrackMuted: false,
    videoTrackMunted: false, 
}

let remoteTracks = {}

document.getElementById('join-btn').addEventListener('click', async ()=> {
    console.log('User Joined Stream')
    await joinStreams()
    document.getElementById('join-btn').style.display = 'none'
    document.getElementById('header-1').style.display = 'none'
    document.getElementById('footer').style.display = 'flex'
})




// event on mute 

document.getElementById('mic-btn').addEventListener('click', async() => {
    if(!localTrackState.audioTrackMuted){
        await localTracks.audioTrack.setMuted(true)
        localTrackState.audioTrackMuted = true
        // to change the color when muted
        document.querySelector('.p-3').style.backgroundColor = 'rgb(255, 80, 80, 0.7)'

        // document.getElementById('mic-btn'). src = './assetcs/volume-off.svg'


    } else {
        await localTracks.audioTrack.setMuted(false)
        localTrackState.audioTrackMuted = false
        document.querySelector('.p-3').style.backgroundColor = '#1f1f1f8e'
    }
})

// function switchMode () {
//     if (p-2.className === 'darkmode') {
//         p-2.class = 'lightmode'
//     } else {
//         p-2.className = 'darkmode'
//     }
// }





// csmera mute

document.getElementById('camera-btn').addEventListener('click', async() => {
    if(!localTrackState.videoTrackMuted){
        await localTracks.videoTrack.setMuted(true)
        localTrackState.videoTrackMuted = true
        document.querySelector('.p-2').style.backgroundColor = 'rgb(255, 80, 80, 0.7)'
    } else {
        await localTracks.videoTrack.setMuted(false)
        localTrackState.videoTrackMuted = false
        document.querySelector('.p-2').style.backgroundColor = '#1f1f1f8e'
    }
})


// /muute end

document.getElementById('leave-btn').addEventListener('click', async () => {
    for (trackName in localTracks) {
        let track = localTracks[trackName]
        if(track) {
            // this is going to turn off your camera and mic
            track.stop()
        //    track close completely disconects your camera from the mic
            track.close()
            localTracks[trackName] = null
        }
    }

    // disconnects from a stream... notifies everyone that this person has left
    await client.leave()
    document.getElementById('user-streams').innerHTML = ''
    document.getElementById('footer').style.display = 'none'
    document.getElementById('header-1').style.display = 'block'
    document.getElementById('join-btn').style.display = 'block'
})




let joinStreams = async () => {

    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

 [config.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all ([
        client.join(config.appid, config.channel, config.token || null, config.uid || null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
    ])

    let videoPlayer = `<div class="video-containers" id="video-wrapper-${config.uid}">
                    <p class="user-uid">${config.uid}</p>
            <div class="video-player player"  id="stream-${config.uid}"></div>
    </div>`


    document.getElementById('user-streams').insertAdjacentHTML("beforeend", videoPlayer)
    localTracks.videoTrack.play(`stream-${config.uid}`)

    await client.publish([localTracks.audioTrack, localTracks.videoTrack])

     
}

// secvond user 

let handleUserLeft = async () => {
    delete remoteTracks[user.uid]
    document.getElementById(`video-wrapper-${user.uid}`)

}





let handleUserJoined = async (user, mediaType) => {
    console.log('user has joined our stream')
    remoteTracks[user.uid] = user

    await client.subscribe(user,mediaType )


  let videoplayer = document.getElementById(`video-wrapper-${user.uid}`)

  if (videoplayer != null){
      videoPlayer.remove()
  }


        if (mediaType === 'video')  {
                
                let videoPlayer = `<div class="video-containers" id="video-wrapper-${user.uid}>
                            <p class="user-uid">${user.uid}</p>
                            <div class="video-player player"  id="stream-${user.uid}"></div>
                            </div>`


                    document.getElementById('user-streams').insertAdjacentHTML("beforeend", videoPlayer)
                    user.videoTrack.play(`stream-${user.uid}`)

                        }

        if (mediaType === 'audio') {
                user.audioTrack.play()
        }
 }
