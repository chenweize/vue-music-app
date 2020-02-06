const getters = {
    musicLists: state => state.musicLists,
    musicPlayer: state => state.musicPlayer,
    currentSong: state => {
        return state.musicPlayer.playList?state.musicPlayer.playList[state.musicPlayer.currentIndex] : {}
    }
    // hots: state => state.musicLists.hots,
    // singers: state => state.musicLists.singers
}
export default getters
