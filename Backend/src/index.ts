import  express,{Application, Request,Response} from "express"
import Routes from './Routes/weatherRoutes'
import dotenv from 'dotenv'
//import http from 'http'
dotenv.config()
import cors from 'cors'


const app : Application = express()
const PORT : any = process.env.PORT || 3000


app.get('/',(req:Request,res:Response):void=>{
    res.status(200).json('Working fine in typescript')
})

app.use(cors())
app.use(express.json())

app.use('/api',Routes)

app.listen(PORT,():void=>{
    console.log(`Server listening at ${PORT}`)
})