import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import { useCurrency } from '@/context/CurrencyContext'; // ✅ added

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState();
  const { convert, currency } = useCurrency(); // ✅ added

  useEffect(() => {
    place && GetPlacePhoto();
  }, [place]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place?.place,
    };
    await GetPlaceDetails(data).then((resp) => {
      const PhotoUrl = PHOTO_REF_URL.replace(
        '{NAME}',
        resp.data.places[0].photos[3].name
      );
      setPhotoUrl(PhotoUrl);
    });
  };

  // ✅ Parse ticket pricing safely
  const parsePrice = (priceStr) => {
    if (!priceStr) return null;

    // Extract digits from something like "₹500" or "Ticket: 20 EUR"
    const match = priceStr.toString().match(/\d+(\.\d+)?/);
    if (match) {
      return parseFloat(match[0]);
    }
    return null; // no number found
  };

  const rawPrice = parsePrice(place?.ticket_pricing);
  const formattedTicketPrice = rawPrice
    ? `${convert(rawPrice)} ${currency}`
    : place?.ticket_pricing || 'N/A'; // fallback to original string if no number

  return (
    <Link
      to={'https://www.google.com/maps/search/?api=1&query=' + place?.place}
      target="_blank"
    >
      <div className="shadow-sm border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 hover:shadow-md cursor-pointer transition-all">
        <img
          src={photoUrl ? photoUrl : '/placeholder.jpg'}
          alt=""
          className="w-[130px] h-[130px] rounded-xl object-cover"
        />
        <div>
          <h2 className="font-bold text-lg">{place.place}</h2>
          <p className="text-sm text-gray-500">{place.details}</p>

          <h2 className="text-xs font-medium mt-2 mb-2">
            🏷️ Ticket: {formattedTicketPrice}
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
