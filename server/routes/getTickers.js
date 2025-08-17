import axios from "axios";

let cachedTickers = null;
let lastFetchedTickers = 0;
const CACHE_DURATION = 15 * 60 * 1000; 

function roundUp(num, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.ceil(num * factor) / factor;
}

export async function getTickers() {
  const now = Date.now();

  if (!cachedTickers || now - lastFetchedTickers > CACHE_DURATION) {
    try {

      const response1 = await axios.get("https://api.coinpaprika.com/v1/global");
      const response2 = await axios.get("https://api.coinpaprika.com/v1/tickers");


      cachedTickers = {
        marCap: roundUp(response1.data.market_cap_usd / Math.pow(10, 12), 3),
        vol24: roundUp(response1.data.volume_24h_usd / Math.pow(10, 9), 1),  
        bitDom: response1.data.bitcoin_dominance_percentage,
        cryNum: response1.data.cryptocurrencies_number.toLocaleString(),

        bitCap: roundUp(response2.data.find(c => c.id === "btc-bitcoin").quotes.USD.market_cap/ Math.pow(10, 12), 3),
        bitPrice: Math.ceil(response2.data.find(c => c.id === "btc-bitcoin").quotes.USD.price).toLocaleString(),
        ethCap: roundUp(response2.data.find(c => c.id === "eth-ethereum").quotes.USD.market_cap/ Math.pow(10, 9), 1),
        solCap: roundUp(response2.data.find(c => c.id === "sol-solana").quotes.USD.market_cap/ Math.pow(10, 9), 1),
        usdtCap: roundUp(response2.data.find(c => c.id === "usdt-tether").quotes.USD.market_cap/ Math.pow(10, 9), 1),
        usdcCap: roundUp(response2.data.find(c => c.id === "usdc-usd-coin").quotes.USD.market_cap/ Math.pow(10, 9), 1),
        xrpCap: roundUp(response2.data.find(c => c.id === "xrp-xrp").quotes.USD.market_cap/ Math.pow(10, 9), 1),
        bnbCap: roundUp(response2.data.find(c => c.id === "bnb-binance-coin").quotes.USD.market_cap/ Math.pow(10, 9), 1),
      };

      lastFetchedTickers = now;
      console.log("Fetched tickers:", cachedTickers);
    } catch (error) {
      console.error("Failed to fetch tickers:", error.message);
      cachedTickers = null;
    }
  }

  return cachedTickers;

}