import { db } from '@/service/firebaseConfig';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import DownloadPDF from '../components/DownloadPdf';
import FlightRecommendations from '../components/FlightRecommendations';
import CostBreakdown from '../components/CostBreakdown';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) GetTripData();
  }, [tripId]);

  // fetch trip info from firebase
  const GetTripData = async () => {
    const docRef = doc(db, 'AITrips', tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTrip(docSnap.data());
    } else {
      toast.error('No trip found');
    }
  };

  if (!trip) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading trip details...
      </div>
    );
  }
  console.log("Trip data from Firestore:", trip);

  return (
    <div className="px-5 sm:px-10 md:px-16 lg:px-28 xl:px-40 py-12 space-y-16">
      {/* Trip Overview / Hero */}
      <section>
        <InfoSection trip={trip} />
      </section>

      {/* Hotels Section */}
      <section className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
          Recommended Hotels
        </h2>
        <Hotels trip={trip} />
      </section>

      {/* Daily Plan Section */}
      <section className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
          Daily Plan
        </h2>
        <PlacesToVisit trip={trip} />
      </section>

      {/* ✅ Cost Breakdown Section */}
      {trip.tripData?.cost_breakdown && (
  <section className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10">
    <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
      Estimated Cost Breakdown
    </h2>
    <CostBreakdown cost={trip.tripData.cost_breakdown} />
  </section>
)}

      {/* Flight Recommendations Section */}
      <section className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
          Search Flights
        </h2>
        <FlightRecommendations trip={trip} />
      </section>


      {/* PDF - Export Button */}
      <DownloadPDF trip={trip} />

      {/* Footer */}
      <Footer trip={trip} />
    </div>
  );
}

export default Viewtrip;
