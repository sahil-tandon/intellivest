import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, set } from "firebase/database";
import { db } from "../firebase";

function StockDetail() {
  const { symbol } = useParams();
  const [notes, setNotes] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const widgetConfig = {
    autosize: true,
    symbol: `${symbol}`,
    interval: "D",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "in",
    toolbarColor: "#ff0000",
    enable_publishing: false,
    withdateranges: true,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    details: true,
    hotlist: true,
    calendar: false,
    studies: ["STD;SMA", "STD;Price%1Target"],
    container_id: "tradingview_widget",
    backgroundColor: "#161029",
    gridColor: "#241837",
  };

  const iframeUrl = `https://www.tradingview.com/widgetembed/?${new URLSearchParams(
    widgetConfig
  )}`;

  useEffect(() => {
    const notesRef = ref(db, `stockNotes/${symbol}`);
    onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNotes(data.text || "");
        setLastUpdated(data.lastUpdated || null);
      } else {
        setNotes("");
        setLastUpdated(null);
      }
    });
  }, [symbol]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const saveNotes = () => {
    const now = new Date().toISOString();
    set(ref(db, `stockNotes/${symbol}`), {
      text: notes,
      lastUpdated: now,
    });
    setLastUpdated(now);
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-8">{symbol} Stock Details</h1>
      <div className="w-full h-[600px]">
        <iframe
          src={iframeUrl}
          style={{ width: "100%", height: "100%" }}
          frameBorder="0"
          allowTransparency="true"
          scrolling="no"
          allowFullScreen
        ></iframe>
      </div>
      <div className="mb-8 mt-16">
        <h2 className="text-2xl font-bold mb-4">Notes</h2>
        <textarea
          className="w-full h-40 p-2 border border-gray-300 rounded-md bg-background text-text-primary"
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add your notes here..."
        ></textarea>
        <div className="flex justify-between items-center mt-2">
          <button
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-200"
            onClick={saveNotes}
          >
            Save Notes
          </button>
          {lastUpdated && (
            <span className="text-sm text-text-secondary">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default StockDetail;
