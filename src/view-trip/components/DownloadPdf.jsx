import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DownloadPDF({ trip }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("JourniQ Itinerary", 14, 20);

    // Trip Info
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

    let yPos = 50; // starting Y position

    // ✅ Cost Breakdown Section
    if (trip?.tripData?.cost_breakdown) {
      doc.setFontSize(14);
      doc.text("Estimated Cost Breakdown", 14, yPos);

      const costData = trip.tripData.cost_breakdown;

      // Separate total
      const totalValue = costData.total || costData.Total || null;
      const otherCosts = Object.entries(costData).filter(
        ([key]) => key.toLowerCase() !== "total"
      );

      // Regular costs table
      autoTable(doc, {
        head: [["Category", "Estimated Cost"]],
        body: otherCosts.map(([key, value]) => [
          key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          value,
        ]),
        startY: yPos + 5,
        theme: "grid",
        styles: { fontSize: 10 },
      });

      // Position after costs table
      yPos = doc.lastAutoTable.finalY + 5;

      // Highlighted Total row
      if (totalValue) {
        autoTable(doc, {
          body: [["Total", totalValue]],
          startY: yPos,
          theme: "grid",
          styles: { fontSize: 12, halign: "right" },
          columnStyles: {
            0: { fontStyle: "bold", fillColor: [200, 220, 255] }, // Category col
            1: { fontStyle: "bold", fillColor: [200, 220, 255] }, // Value col
          },
        });

        yPos = doc.lastAutoTable.finalY + 15;
      }
    }


    // ✅ Itinerary Section
    trip?.tripData?.itinerary?.forEach((day, i) => {
      doc.setFontSize(14);
      doc.text(day.day || `Day ${i + 1}`, 14, yPos);

      const rows =
        day.plan?.map((p) => [
          p.place || "-",
          p.details || "-",
          p.ticket_pricing || "-",
        ]) || [];

      autoTable(doc, {
        head: [["Place", "Details", "Ticket"]],
        body: rows,
        startY: yPos + 5,
        theme: "grid",
        styles: { fontSize: 10 },
      });

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
