import { elements } from '../views/baseView';

export const musicHandler = {
    currentlyPlaying: "none",
    currentAudio: undefined,
    
    basePath: "../music/",
    forest: "../music/forest.ogg",
    find: "../music/find.ogg",
    lobby: "../music/lobby.ogg",
    
    volume: 0.5,
    volumeFX: 0.5,

    playMusic: music => {
            //console.log(musicHandler);
            //console.log("playmusic called");

            if (music == "none") {
                musicHandler.stopMusic();
            }
            else if (music != musicHandler.currentlyPlaying) {
                // stop previous music
                if (musicHandler.currentAudio != undefined) {
                    document.body.removeChild(musicHandler.currentAudio);
                }
                
                // start new music
                if (music[music.length - 1] == "$") {
                    musicHandler.currentlyPlaying = music;
                    var audio = new Audio();
                    const path = musicHandler.basePath + music.replace("$", "") + "start.ogg";
                    //console.log(path);
                    audio.setAttribute('src', path);
                    audio.setAttribute('hidden', 'true');
                    audio.volume = musicHandler.volume;
                    document.body.appendChild(audio);
                    musicHandler.currentAudio = audio;
                    
                    audio.addEventListener('timeupdate', function(){
                        var buffer = 0.1
                        if (this.currentTime > this.duration - buffer) {
                            //console.log("moving into full swing");
                            const temp = musicHandler.currentAudio;

                            var audio = new Audio();
                            const path = musicHandler.basePath + music.replace("$", "") + "full.ogg"
                            audio.setAttribute('src', path);
                            // looping
                            audio.addEventListener('timeupdate', function(){
                                var buffer = .2
                                if(this.currentTime > this.duration - buffer){
                                    this.currentTime = 0
                                    this.play()
                                }
                            })
                            // ---
                            audio.setAttribute('hidden', 'true');
                            audio.volume = musicHandler.volume;
                            document.body.appendChild(audio);
                            musicHandler.currentAudio = audio;
                            audio.play()
                            document.body.removeChild(temp);
                        }
                    });
                    
                    audio.play();
                } else {
                    musicHandler.currentlyPlaying = music;
                    var audio = new Audio();
                    audio.setAttribute('src', musicHandler[music]);
                    audio.setAttribute('loop', 'true');
                    audio.setAttribute('hidden', 'true');
                    audio.volume = musicHandler.volume;
                    document.body.appendChild(audio);
                    musicHandler.currentAudio = audio;
                    audio.play();
                }
            } else {
                musicHandler.currentAudio.play();
            }
    },

    pauseMusic: () => {
        if (musicHandler.currentAudio != undefined) {
            musicHandler.currentAudio.pause();
        }
    },

    stopMusic: () => {
        if (musicHandler.currentAudio != undefined) {
            document.body.removeChild(musicHandler.currentAudio);
            musicHandler.currentAudio = undefined;
            musicHandler.currentlyPlaying = "none"
        }
    },

    changeVolume: (volume, type) => {
        if (volume > 1 || volume < 0) {
            return false;
        } else if (type == "volume" || type == "volumeFX") {
            if (musicHandler.currentAudio != undefined && type == "volume") {
                musicHandler.currentAudio.volume = volume;
            };
            musicHandler[type] = volume;
            return true;
        } else {
            return false;
        }
    },

    playFX: (music) => {
        var fx = new Audio();
        fx.setAttribute('src', musicHandler[music]);
        fx.setAttribute('hidden', 'true');
        fx.volume = musicHandler.volumeFX;
        document.body.appendChild(fx);
        fx.addEventListener('ended', fx => {
            document.body.removeChild(fx.path[0]);
        });
        fx.play();
    }
}