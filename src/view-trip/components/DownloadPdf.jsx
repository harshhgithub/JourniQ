import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DownloadPDF({ trip }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("JourniQ Itinerary", 14, 20);

    // Trip Info (fix for object values)
    const destination =
      typeof trip?.userSelection?.location === "object"
        ? trip?.userSelection?.location?.label ||
          trip?.userSelection?.location?.name ||
          JSON.stringify(trip?.userSelection?.location)
        : trip?.userSelection?.location || "N/A";

         const days =
      trip?.userSelection?.days && !isNaN(trip?.userSelection?.days)
        ? trip?.userSelection?.days
        : trip?.tripData?.itinerary?.length || "N/A";


    doc.setFontSize(12);
    doc.text(`Destination: ${destination}`, 14, 30);
    doc.text(`Duration: ${days} Days`, 14, 38);

    let yPos = 50; // starting Y position for itinerary tables

    // Loop over each day
    trip?.tripData?.itinerary?.forEach((day, i) => {
      doc.setFontSize(14);
      doc.text(day.day || `Day ${i + 1}`, 14, yPos);

      const rows =
        day.plan?.map((p) => [
          p.time || "-",
          p.place || "-",
          p.details || "-",
          p.ticket_pricing || "-",
        ]) || [];

      autoTable(doc, {
        head: [["Time", "Place", "Details", "Ticket"]],
        body: rows,
        startY: yPos + 5,
        theme: "grid",
        styles: { fontSize: 10 },
      });

      // Move Y position after table
      yPos = doc.lastAutoTable.finalY + 10;
    });

    // Save file
    doc.save("itinerary.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 
                 text-white font-medium shadow-lg hover:scale-105 transition-all duration-300
                 dark:from-indigo-500 dark:to-purple-600"
    >
      Download Itinerary (PDF)
    </button>
  );
}

export default DownloadPDF;

