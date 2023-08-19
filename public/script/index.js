const liffId = '2000223015-E1wxd95K'

async function main(){
    await liff.init({liffId:liffId});
    liff.ready.then(()=>{
        console.log(liff.isLoggedIn())
        if(!liff.isLoggedIn()){
            liff.login()
        }
        liff.getProfile().then(profile =>{
            userId = profile.userId
            console.log("User Id ====> ", userId)
            // liff.closeWindow()
        })
    })
}

main()

async function close(){
    console.log('close')
    console.log(userId)
    liff.closeWindow()
}

async function send(e){
    // e.preventDefault();
    const StudentNumber = document.getElementById("StudentNumber").value
    const Class = document.getElementById("Class").value
    const Room = document.getElementById("Room").value
    const Number = document.getElementById("Number").value
    try {
        const result = await axios.post("https://testweb-ag7d.onrender.com/api/v1/link-richmenu", {
            StudentNumber:StudentNumber,
            Class:Class,
            Room:Room,
            Number:Number,
            userId:userId
        })
        // console.log(result)
        if(result.status == 200){
            console.log("done")
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = close