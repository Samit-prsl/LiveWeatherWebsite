import {Request,Response} from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const Weather = async(req:Request,res:Response) =>{

    const API_KEY = process.env.API_KEY

    try {

        const { latitude,longitude } = req.body
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
        res.status(200).json(response.data)

    } catch (error) {

        res.status(500).json(error)

    }

}

export default { Weather }