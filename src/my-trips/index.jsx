import { collection, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/service/firebaseConfig";
import UserTripCardItem from "./components/UserTripCardItem";
import { Button } from "@/components/ui/button";

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }
    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);
    let trips = [];
    querySnapshot.forEach((doc) => {
      trips.push(doc.data());
    });
    setUserTrips(trips);
    setLoading(false);
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 px-5 py-20 bg-background text-foreground transition-colors">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="font-extrabold text-3xl md:text-5xl text-neutral-900 dark:text-neutral-100">
          My Trips
        </h2>
        <p className="text-lg text-gray-600 dark:text-neutral-300">
          All your generated travel plans are saved here. Pick up right where you left off.
        </p>
      </div>

      {/* Trips List */}
<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
  {loading ? (
    // Skeleton loading cards
    [1, 2, 3, 4, 5, 6].map((item) => (
      <div
        key={item}
        className="h-[250px] w-full bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-xl shadow-sm"
      ></div>
    ))
  ) : userTrips?.length > 0 ? (
    userTrips.map((trip, index) => (
      <UserTripCardItem trip={trip} key={index} />
    ))
  ) : (
    // Empty state
    <div className="col-span-full flex flex-col items-center text-center mt-10">
      <Plane className="w-12 h-12 text-gray-400" />
      <h3 className="mt-4 text-xl font-semibold">No trips yet</h3>
      <p className="text-gray-500 mt-2">
        Start planning your next adventure and your trips will appear here.
      </p>
      <Button
        className="mt-6 px-6 py-3 text-lg rounded-xl shadow-md hover:shadow-lg"
        onClick={() => navigate("/create-trip")}
      >
        Create a Trip
      </Button>
    </div>
  )}
</div>

    </div>
  );
}

export default MyTrips;
