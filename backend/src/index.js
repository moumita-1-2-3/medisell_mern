// require ('dotenv').config({path:'./env'})
import dotenv  from 'dotenv'
import connectDB from './db/index.js'
import app from './app.js'

dotenv.config({ path: '.env' })
console.log("index.js")
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{console.log(`Server running on port ${process.env.PORT}`)})
})
.catch((err)=>{
    console.error(`Error: ${err}. Please try again!`)
})