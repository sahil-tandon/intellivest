import React from "react";
import { useParams } from "react-router-dom";

function StockDetail() {
  const { symbol } = useParams();

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-8">{symbol} Stock Details</h1>
      <div className="w-full h-[600px]">
        <iframe
          src={`https://www.tradingview.com/widgetembed/?symbol=${symbol}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=exchange&withdateranges=1&showpopupbutton=1&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en`}
          style={{ width: "100%", height: "100%" }}
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
}

export default StockDetail;
