import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (hotel) GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.name,
    };
    await GetPlaceDetails(data).then((resp) => {
      const PhotoUrl = PHOTO_REF_URL.replace(
        '{NAME}',
        resp.data.places[0].photos[3].name
      );
      setPhotoUrl(PhotoUrl);
    });
  };

  return (
    <Link
      to={
        'https://www.google.com/maps/search/?api=1&query=' +
        hotel?.name +
        ',' +
        hotel?.address
      }
      target="_blank"
    >
      <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.03] transition-all bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 cursor-pointer">
        {/* Hotel Image with gradient overlay */}
        <div className="relative">
          <img
            src={photoUrl || '/placeholder.jpg'}
            alt={hotel?.name || 'Hotel'}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

          {/* Rating badge floating top-right */}
          <span className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-800 px-2 py-1 rounded-full text-xs font-semibold text-gray-900 dark:text-gray-100 shadow">
            ⭐ {hotel?.rating || 'N/A'}
          </span>
        </div>

        {/* Details */}
        <div className="p-4">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
            {hotel?.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
            📍 {hotel?.address}
          </p>

          <div className="flex justify-between items-center mt-4">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
              💰 {hotel?.price || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
