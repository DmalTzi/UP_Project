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
            const result = axios.post("https://hdrproject.onrender.com/api/liff/login", {
                userId:userId
            })
            window.location.href = "/sign_in";
        })
    })
}

main()