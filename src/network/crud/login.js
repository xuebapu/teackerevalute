import {requestLocal} from "../requestLocal";

export function login(phone,yzm) {
    return requestLocal({
        url:'/login',
        params:{
            phone: phone,
            yzm: yzm,
        },
    })
}