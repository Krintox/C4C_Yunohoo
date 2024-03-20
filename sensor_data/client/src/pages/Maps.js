import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from "../UserContext";
import axios from 'axios'
import {Map, GoogleApiWrapper} from 'google-map-react'

const Maps = () => {

    const API_endpoint = `https://api.openweathermap.org/data/2.5/weather?`
    const API_Key = `7556256370d722c8a6e29d88f71399ed`
    //  gmaps api key = AIzaSyC3mZg6P7r2AzeOdm4XiQTmHora9Zs3fGQ
    // const API_Key = `c5a48b3e59d242aedae7b2fb0b9ad0e4`
    // lat={lat}&lon={lon}&exclude={part}&appid={API key}

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');  
    // const {setUserInfo,userInfo, longitude, latitude, setLatitude, setLongitude} = useContext(UserContext);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords)
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)

            let finalAPIEndpoint = `${API_endpoint}lat=${latitude}&lon=${longitude}&appid=${API_Key}`

            axios.get(finalAPIEndpoint)
            .then((response)=>{
                console.log(response.data)
            })
        })
    }, [])
    

  return (
    <div>
        Map
        <p>
            the latitude is: {
                latitude
            }
        </p>
    </div>
  )
}

export default Maps