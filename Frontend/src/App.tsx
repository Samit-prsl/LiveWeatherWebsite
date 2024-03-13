import axios from 'axios';
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import io from 'socket.io-client';

interface Location {
  latitude : Number | null;
  longitude : Number | null;
}

interface responseData {
  main : {
    temp_max : any | null;
    humidity : string | null;
  }
}

function App() {

  const socket = io('http://localhost:8000')
 
  const [Location,SetLocation] = useState<Location | null>(null)
  const [Data,SetData] = useState<responseData | null>(null)
  const [Name,SetName] = useState<string | null>("")
  //const [weatherId,SetweatherId] = useState<number | null>(null)
  const [Loading,SetLoading] = useState<boolean | null>(false)
  const [Popup,SetPopup] = useState<boolean | null>(false)
  const [counter,Setcounter] = useState<number | null>(null)
  
  let Id = 0

  const getLocationFromLatsAndLong = () =>{
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          SetLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          toast.success('Location Updated!',{style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#040D12',
            background :'#D3C185'
        }})
        },
        (error) => {
          console.log(error)
        }
      );
    } else {
      toast.error("Geolocation not supported!",{style: {
        border: '1px solid #713200',
        padding: '16px',
        color: '#040D12',
        background :'#D3C185'
    }});
      
    }
  }

const getweather30s = async () =>{
  const ressss =  socket.emit('send',Location)
  console.log(ressss);
  try {
    
    const Res = await axios.post('https://liveweatherwebsite.onrender.com/api/weather',{
      latitude : Location?.latitude,
      longitude : Location?.longitude
      })
    SetData(Res.data)
    SetName(Res.data.name)
    Id = Res.data.weather[0].id
    toast.success("Loading weather!😑",{style: {
      border: '1px solid #713200',
      padding: '16px',
      color: '#040D12',
      background :'#D3C185'
  }})
    console.log(Res.data.weather[0].id);
    console.log(Id);
    
  } catch (error) {
    console.log(error); 
    toast.error("Something went wrong! 🤔",{style: {
      border: '1px solid #713200',
      padding: '16px',
      color: '#040D12',
      background :'#D3C185'
  }})
  }
  
}

setInterval(getweather30s,30000)

  const getWeatherandLocationDetails = async()=>{

      try {
        
        SetLoading(true)
        const Res = await axios.post('https://liveweatherwebsite.onrender.com/api/weather',{
        latitude : Location?.latitude,
        longitude : Location?.longitude
        })
      SetData(Res.data)
      SetName(Res.data.name)
      Id = Res.data.weather[0].id
      toast.success("Loading weather!😑",{style: {
        border: '1px solid #713200',
        padding: '16px',
        color: '#040D12',
        background :'#D3C185'
    }})
      console.log(Res.data.weather[0].id);
      console.log(Id);
      
      SetLoading(false)
      SetPopup(false)

      } catch (error) {
        console.log(error);
        toast.error("Something went wrong! 🤔",{style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#040D12',
          background :'#D3C185'
      }})
      }
      
  }

  function countdownTimer(duration:number) {
    let timer = duration;
    const interval = setInterval(() => {
      const seconds = timer % 60;
      //console.log(seconds);
      Setcounter(seconds)
      //console.log(counter);
      
      if (--timer < 0) {
        clearInterval(interval);
      }
    }, 1000);
  }
  

  useEffect(()=>{
    getLocationFromLatsAndLong()
    countdownTimer(30)
  },[])

  return (
    <>
      {
        Popup ? 
        <>
            <div className=' bg-[#040D12] min-h-screen flex justify-center items-center p-10'>
                {
                  Data ? 
                  <>
                    {
                      ( Id >=  700 && Id < 750 ) ? (
                          <img src="https://unsplash.com/photos/a-person-standing-on-top-of-a-sand-dune-brFQojtwSzE" alt="Thunderstorm GIF" className=' h-full w-full object-cover' />
                      ):(
                        <p className=' text-white'>Bruhhhhh!!!</p>
                      )
                    }
                  </> 
                  :
                  <>
                       <div className=' flex justify-between items-center gap-4 my-2 text-[#D3C185] font-[Poppins]text-3xl'>
                            No data found 🤞
                        </div>
                  </>
                }
            </div>
        </> 
        : 
        <>
              <div className=' bg-[#040D12] min-h-screen flex justify-center items-center p-10'>
          <div className='  min-h-96 w-full bg-transparent  lg:p-5 p-2 rounded-[3rem] flex flex-col justify-center items-center gap-8'>
              <h1 className=' text-[#D3C185] text-center text-4xl font-[Quicksand]'>Welcome folks! Lets have your Live Weather.</h1>
              <div className=' h-full my-4 lg:p-5 lg:my-8 '>
                  {
                    Data ?
                    <>
                      <div className=' flex justify-between items-center lg:gap-4 gap-2 my-2 text-[#D3C185] font-[Poppins]'>
                          <p>Current City/Town :</p>
                          <p>{Name}</p>
                      </div>
                      <div className=' flex justify-between items-center gap-4 my-2 text-[#D3C185] font-[Poppins]'>
                          <p>Current Tempature :</p>
                          <p>{(Data.main.temp_max - 273).toFixed(2)} °C</p>
                      </div>
                      <div className=' flex justify-center items-center gap-4 my-2 text-[#D3C185] font-[Poppins]'>
                          <p>Humidity :</p>
                          <p>{Data.main.humidity} %</p>
                      </div>
                    </> 
                    : 
                    <>
                        <div className=' flex justify-between items-center gap-4 my-2 text-[#D3C185] font-[Poppins]text-3xl'>
                            It will automatically take in your location, and give you real time weather data after {counter}s, so please wait, if you in a hurry you can click the button below!
                        </div>
                    </>
                  }
              </div>
              <div className=' h-full p-5 flex justify-center items-center'>
                  <button onClick={getWeatherandLocationDetails} className={` px-10 py-3 bg-[#183D3D] text-[#d4af37] font-[Poppins] rounded-xl hover:bg-[#112e2e] ${Loading ? 'cursor-not-allowed':'cursor-pointer'} `}>Get Details</button>
              </div>
              <div className=' h-full justify-end items-center '>
                    {counter}
              </div>
          </div>
      
      
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      </div>
        </>
      }
    </>
  )

}
export default App
