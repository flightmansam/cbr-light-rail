import json5 from "json5"

async function get_data(){
    const response = await fetch('http://localhost:4050/live') //fetch("https://jsonplaceholder.typicode.com/users")//
    if(response.status === 200) {
        let data = await response.json()
        return data
    }
}

export {get_data}