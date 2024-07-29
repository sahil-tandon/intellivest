const express = require("express");
const yahooFinance = require("yahoo-finance");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/stock-prices", async (req, res) => {
  try {
    const { symbols } = req.query;
    const symbolsList = symbols.split(",");

    const quotes = await new Promise((resolve, reject) => {
      yahooFinance.quote(
        {
          symbols: symbolsList,
          modules: ["price"],
        },
        function (err, quotes) {
          if (err) {
            reject(err);
          } else {
            resolve(quotes);
          }
        }
      );
    });

    const formattedPrices = {};
    symbolsList.forEach((symbol) => {
      const price = quotes[symbol]?.price?.regularMarketPrice;
      if (price !== undefined) {
        formattedPrices[symbol] = price;
      }
    });

    res.json(formattedPrices);
  } catch (error) {
    console.error("Error fetching stock prices:", error);
    res.status(500).json({ error: "Failed to fetch stock prices" });
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
