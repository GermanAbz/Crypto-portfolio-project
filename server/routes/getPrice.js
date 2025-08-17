import axios from "axios";

let cachedPrices = null;
let lastFetched = 0;
const CACHE_DURATION = 15 * 60 * 1000; 

export async function getPrice() {
  const now = Date.now();

  if (!cachedPrices || now - lastFetched > CACHE_DURATION) {
    try {
      const result = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,tether,binancecoin,solana,usd-coin,staked-ether,dogecoin&vs_currencies=usd",
        {
          headers: {
            "User-Agent": "MyCryptoApp/1.0 (gabzaletdinov@gmail.com)",
            Accept: "application/json",
          },
        }
      );


      cachedPrices = {
        btc: result.data.bitcoin.usd,
        eth: result.data.ethereum.usd,
        xrp: result.data.ripple.usd,
        usdt: result.data.tether.usd,
        bnb: result.data.binancecoin.usd,
        sol: result.data.solana.usd,
        usdc: result.data["usd-coin"].usd,
        lidStEth: result.data["staked-ether"].usd,
        doge: result.data.dogecoin.usd,
      };

      lastFetched = now;
      console.log("Fetched prices:", cachedPrices);
    } catch (error) {
      console.error("Failed to fetch prices:", error.message);
      cachedPrices = null;
    }
  }

  return cachedPrices;

}
