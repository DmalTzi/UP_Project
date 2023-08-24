const liffId = '2000223015-E1wxd95K'
let userId = ''

function main(){
    liff.init({liffId:liffId});
    liff.ready.then(()=>{
        console.log(liff.isLoggedIn())
        if(!liff.isLoggedIn()){
            liff.login()
        }
        liff.getProfile().then(profile =>{
            userId = profile.userId
            console.log("User Id ====> ", userId)
        })
    })
}

main()

async function send(e){
    e.preventDefault();
    // const TeacherId = document.getElementById("TeacherId").value
    // const Teacherpass = document.getElementById("TeacherPassword").value
    // const StudentNumber = document.getElementById("StudentNumber").value
    // const Class = document.getElementById("Class").value
    // const Room = document.getElementById("Room").value
    // const Number = document.getElementById("Number").value
    try {
        const result = await axios.post("https://326e-58-9-5-183.ngrok-free.app/api/v1/link-richmenu", {
            // // TeacherId:TeacherId,
            // // Teacherpass:Teacherpass,
            // StudentNumber:StudentNumber,
            // Class:Class,
            // Room:Room,
            // Number:Number,
            userId:userId
        })
        console.log(result)
        if(result.status == 200){
            console.log("done")
        }
    } catch (error) {
        console.log(error)
    }
    window.location.href = "/sign_in"; // แทนที่ด้วย URL ที่คุณต้องการ
}
