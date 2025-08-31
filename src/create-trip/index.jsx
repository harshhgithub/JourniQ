import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '@/constants/options';
import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    console.log(formData)
  }, [formData])

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true)
      return;
    }

    if (!formData?.location || !formData?.noOfDays || !formData?.budget || !formData.traveler) {
      toast('Please fill all the details')
      return;
    }

    setLoading(true)

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget)

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    setLoading(false)
    SaveAiTrip(result?.response?.text())
  }

  const SaveAiTrip = async (TripData) => {
    setLoading(true)
    const user = JSON.parse(localStorage.getItem('user'))
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId
    });
    setLoading(false)
    navigate('/view-trip/' + docId)
  }

  const login = useGoogleLogin({
    onSuccess: (res) => GetUserProfile(res),
    onError: (error) => console.log(error)
  })

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo.access_token}`,
        Accept: 'application/json',
      },
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      onGenerateTrip();
    }).catch((error) => {
      console.error("Error fetching user profile: ", error);
    });
  }

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 px-5 py-20 bg-background text-foreground transition-colors">
      {/* Heading */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="font-extrabold text-3xl md:text-5xl text-neutral-900 dark:text-neutral-100">
          Tell us your travel preferences
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-neutral-300">
          Just provide some basic information, and our trip planner will generate 
          a customized itinerary tailored to your preferences.
        </p>
      </div>

      

      {/* Form */}
      <div className="mt-16 flex flex-col gap-12 max-w-4xl mx-auto">
        
        {/* Location */}
<div>
  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
     What is your destination of choice?
  </h3>
  <GooglePlacesAutocomplete
    apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
    selectProps={{
      value: place,
      onChange: (v) => { 
        setPlace(v); 
        handleInputChange('location', v); 
      },
      placeholder: "Search for a city, landmark, or destination...",
      styles: {
        control: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused 
            ? (document.documentElement.classList.contains("dark") ? "#111827" : "#f9fafb") 
            : (document.documentElement.classList.contains("dark") ? "#1f2937" : "#ffffff"),
          borderRadius: "0.75rem",
          border: state.isFocused ? "2px solid #2563eb" : "1px solid #d1d5db",
          boxShadow: "none",
          padding: "6px 8px",
          transition: "all 0.2s ease",
          cursor: "text"
        }),
        input: (provided) => ({
          ...provided,
          color: document.documentElement.classList.contains("dark") ? "#f9fafb" : "#111827",
          fontSize: "1rem",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: document.documentElement.classList.contains("dark") ? "#f9fafb" : "#111827",
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: document.documentElement.classList.contains("dark") ? "#1f2937" : "#ffffff",
          borderRadius: "0.75rem",
          marginTop: "6px",
          padding: "6px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 50,
        }),
        
        option: (provided, state) => {
          const isDark = document.documentElement.classList.contains("dark");
          return {
            ...provided,
            backgroundColor: state.isFocused 
              ? (isDark ? "#2563eb" : "#e5f0ff") 
              : "transparent",
            color: state.isFocused 
              ? (isDark ? "#ffffff" : "#111827") // ✅ fix: dark text in light mode hover
              : (isDark ? "#d1d5db" : "#374151"),
            padding: "10px",
            borderRadius: "0.5rem",
            cursor: "pointer",
          };
        },
        placeholder: (provided) => ({
          ...provided,
          color: document.documentElement.classList.contains("dark") ? "#9ca3af" : "#6b7280",
        }),
      },
    }}
  />
</div>


        {/* Days */}
        <div>
          <h3 className="text-xl font-semibold mb-4">How many days are you planning your trip?</h3>
          <Input 
            placeholder="Ex. 4" 
            type="number" 
            className="rounded-lg border px-4 py-2"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)} 
          />
        </div>

        {/* Budget */}
        <div>
          <h3 className="text-xl font-semibold mb-4">What is your budget?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SelectBudgetOptions.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-6 rounded-lg border bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md cursor-pointer transition-all 
                ${formData?.budget === item.title && 'border-blue-500 shadow-lg'}`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg mt-2">{item.title}</h2>
                <p className="text-sm text-gray-500 dark:text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Travelers */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Who are you traveling with?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SelectTravelList.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-6 rounded-lg border bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md cursor-pointer transition-all 
                ${formData?.traveler === item.people && 'border-blue-500 shadow-lg'}`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg mt-2">{item.title}</h2>
                <p className="text-sm text-gray-500 dark:text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-16 flex justify-center">
        <Button 
          disabled={loading} 
          onClick={onGenerateTrip}
          className="px-8 py-4 text-lg rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          {loading 
            ? <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" /> 
            : 'Generate Trip'}
        </Button>
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogDescription className="space-y-4 text-center">
              <img src="/logo.png" alt="logo" width="80" className="mx-auto" />
              <h2 className="font-bold text-xl">Sign in to see your travel plan</h2>
              <p className="text-gray-500">Use Google authentication to securely sign in</p>
              <Button
                onClick={login}
                className="w-full mt-6 flex gap-3 items-center justify-center"
              >
                <FcGoogle className="h-6 w-6" /> Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateTrip
