const liffId = ''
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
            const result = axios.post("https://localhost:2000/api/liff/login", {
                userId:userId
            })
            window.location.href = "/sign_in";
        })
    })
}

main()