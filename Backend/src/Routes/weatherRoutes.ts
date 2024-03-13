import express, { Router } from 'express'
const router : Router = express()
import weatherControllers from '../Controllers/weatherControllers'

router.post('/weather',weatherControllers.Weather)


export default router