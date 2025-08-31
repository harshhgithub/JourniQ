import React, { useEffect, useState } from 'react'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi'

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState()

  useEffect(() => {
    trip && GetPlacePhoto()
  }, [trip])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    }
    const result = await GetPlaceDetails(data).then((resp) => {
      if (resp.data.places[0]?.photos?.[3]?.name) {
        const PhotoUrl = PHOTO_REF_URL.replace(
          '{NAME}',
          resp.data.places[0].photos[3].name
        )
        setPhotoUrl(PhotoUrl)
      }
    })
  }

  return (
    <div className="relative">
      {/* Hero image */}
      <img
        src={photoUrl || '/placeholder.jpg'}
        alt="Destination"
        className="h-[380px] w-full object-cover rounded-3xl shadow-xl"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

      {/* Content */}
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <h2 className="font-bold text-3xl md:text-4xl tracking-tight mb-4 drop-shadow-md">
          {trip?.userSelection?.location?.label || 'Unknown Destination'}
        </h2>

       {/* Info pills */}
<div className="flex flex-wrap gap-3">
  <span className="px-4 py-2 bg-white/40 border border-white/60 backdrop-blur-md rounded-full text-sm md:text-base font-medium text-gray-900 shadow-sm hover:bg-white/60 transition">
    📅 {trip?.userSelection?.noOfDays} Days
  </span>
  <span className="px-4 py-2 bg-white/40 border border-white/60 backdrop-blur-md rounded-full text-sm md:text-base font-medium text-gray-900 shadow-sm hover:bg-white/60 transition">
    💰 {trip?.userSelection?.budget} Budget
  </span>
  <span className="px-4 py-2 bg-white/40 border border-white/60 backdrop-blur-md rounded-full text-sm md:text-base font-medium text-gray-900 shadow-sm hover:bg-white/60 transition">
    👥 {trip?.userSelection?.traveler} Traveler(s)
  </span>
</div>

      </div>
    </div>
  )
}

export default InfoSection


