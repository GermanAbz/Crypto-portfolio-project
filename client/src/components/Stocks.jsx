import React from "react";

function Stocks({tickers}) {
    return (
    <div className="stock">
        <div className="stockbox stockbox-one">
            <div>
                Crypto Market Overview
            </div>
            <div className="stockbox-overview ">
                <div>Crypto Market Cap: ${JSON.stringify(tickers.marCap)} trillion</div>
                <div>Crypto Market Vol 24h: ${JSON.stringify(tickers.vol24)} billion</div>
                <div>Number of Cryptocurrencies: {tickers.cryNum}</div>
            </div>
        </div>

        <div className="stockbox stockbox-two">
            <div>
                Bitcoin Stats
            </div>
            <div className="stockbox-overview ">
                <div>Bitcoin Price USD: ${tickers.bitPrice}</div>
                <div>Bitcoin Dominance: {JSON.stringify(tickers.bitDom)}%</div>
                <div>Bitcoin Capitalization: ${JSON.stringify(tickers.bitCap)} trillion</div>
            </div>
       
        </div>

        <div className="stockbox stockbox-three">
            <div>
                Top Coins Stats
            </div>
            <div className="stockbox-overview ">
                <div>Ethereum Capitalization: ${JSON.stringify(tickers.ethCap)} billion</div>
                <div>XRP Capitalization: ${JSON.stringify(tickers.xrpCap)} billion</div>
                <div>BNB Capitalization: ${JSON.stringify(tickers.bnbCap)} billion</div> 
                <div>Solana Capitalization: ${JSON.stringify(tickers.solCap)} billion</div>  
                <div>USDT Capitalization: ${JSON.stringify(tickers.usdtCap)} billion</div>
                <div>USDC Capitalization: ${JSON.stringify(tickers.usdcCap)} billion</div>
            </div>
        </div>
    </div>
    );
}


export default Stocks;