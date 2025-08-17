import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function Charts({ notes, prices }) {
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    const pieCtx = pieRef.current.getContext("2d");
    const barCtx = barRef.current.getContext("2d");

    
    if (pieChartInstance.current) pieChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();

    const titleMap = {
      Bitcoin: "btc",
      Ethereum: "eth",
      XRP: "xrp",
      USDT: "usdt",
      BNB: "bnb",
      Solana: "sol",
      USDC: "usdc",
      "Lido Staked Ether": "lidStEth",
      Dogecoin: "doge"
    };

    const labels = [];
    const usdData = [];
    const backgroundColors = [];

    const colorPalette = [
      "#FF6384", "#36A2EB", "#f3ddaa",
      "#4BC0C0", "#9966FF", "#FF9F40",
      "#cf82bc", "#8bc26a", "#5853c7", "#FFD733"
    ];

    
    notes.forEach((note, index) => {
      const symbolKey = titleMap[note.title];
      const price = prices[symbolKey];
      const amount = parseFloat(note.content);

      if (!isNaN(price) && !isNaN(amount)) {
        labels.push(note.title);
        usdData.push(parseFloat((price * amount).toFixed(2)));
        backgroundColors.push(colorPalette[index % colorPalette.length]);
      }
    });

    
    const combined = labels.map((label, i) => ({
      label,
      value: usdData[i],
      color: backgroundColors[i]
    }));
    combined.sort((a, b) => b.value - a.value);

    const sortedLabels = combined.map(item => item.label);
    const sortedData = combined.map(item => item.value);
    const sortedColors = combined.map(item => item.color);

   
    pieChartInstance.current = new Chart(pieCtx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data: usdData,
            backgroundColor: backgroundColors,
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#ECEFCA",
              boxWidth: 20,
              padding: 20,
              font: {
                size: 14,
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              },
            },
          },
          title: {
            display: usdData.length > 0,
            text: "Portfolio distribution - pie chart",
            color: "#ECEFCA",
            font: {
              size: 20,
              weight: "bold",
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            },
          },
        },
      },
    });


if (sortedData.length > 0) {
  barChartInstance.current = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: sortedLabels,
      datasets: [
        {
          label: "Price (USD)",
          data: sortedData,
          backgroundColor: sortedColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      indexAxis: "y", 
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Portfolio distribution - bar chart",
          color: "#ECEFCA",
          font: {
            size: 20,
            weight: "bold",
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
        },
      },
      scales: {
        x: {
          type: "linear",
          ticks: { color: "#ECEFCA" },
          title: {
            display: true,
            text: "Price (USD)",
            color: "#ECEFCA",
            font: { size: 14 },
          },
        },
        y: { ticks: { color: "#ECEFCA" } },
      },
    },
  });
}


    return () => {
      if (pieChartInstance.current) pieChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [notes, prices]);

  return (
    <div className="charts">
      <div className="pie-chart">
        <canvas ref={pieRef} />
      </div>
      <div className="bar-chart" style={{ marginTop: "40px" }}>
        <canvas ref={barRef} />
      </div>
    </div>
  );
}

export default Charts;

