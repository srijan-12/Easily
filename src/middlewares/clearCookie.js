function clearCookie(recruiterId,seekerID){
        if(recruiterId){
            res.clearCookie("recruiterId");
        }
        if(seekerID){
            res.clearCookie("seekerID");
        }
}

module.exports = clearCookie;