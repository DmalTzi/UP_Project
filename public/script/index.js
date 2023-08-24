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
            const result = axios.post("https://fe59-2405-9800-b911-1c9f-1c08-2a5d-b121-cfea.ngrok-free.app/api/liff/login", {
                userId:userId
            })
            window.location.href = "/sign_in";
        })
    })
}

main()