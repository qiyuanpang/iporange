import { useState, useEffect } from 'react';

function SubmitUserData(data) {
    // const [isExistent, setIsExistent] = useState(0);
    
    // console.log(data)
    var exist = 0;
    const email = data.email;
    const username = data.username;
    const password = data.password;
    const url = "/api/signup/" + email + "/" + username + "/" + password;
    var isExistent = 2;
    fetch(url).then(response => {
        return response.json()
    }).then(existornot => {
        // setIsExistent(existornot[0].EXIST);
        isExistent = existornot[0].EXIST;
        // console.log(isExistent)
    })
    // useEffect(() => {
    //     fetch(url).then(response => {
    //         return response.json()
    //     }).then(existornot => {
    //         setIsExistent(existornot[0].EXIST);
    //     })
    // }, [])
    // console.log(isExistent)
    return isExistent;    
};

export default SubmitUserData;