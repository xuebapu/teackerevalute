import {requestLocal} from "../requestLocal";

export function sendSms(phone) {
    return requestLocal({
        url:'/getyzm',
        params:{
            phone: phone,
        },
    })
}