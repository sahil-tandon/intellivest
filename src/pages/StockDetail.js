import React from "react";
import { useParams } from "react-router-dom";

function StockDetail() {
  const { symbol } = useParams();

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
    </div>
  );
}

export default StockDetail;
