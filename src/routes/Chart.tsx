import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "../atom";

interface ChartProps {
  coinId: string;
}

interface IData {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart({ coinId }: ChartProps) {
  const darkMode = useRecoilValue(darkModeAtom);
  const { isLoading, data } = useQuery<IData[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );
  return (
    <h1>
      {isLoading ? (
        "Loading Chart..."
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "price",
              data: data?.map((price) => price.close),
            },
          ]}
          options={{
            theme: {
              mode: darkMode ? "dark" : "light",
            },
            chart: {
              height: 500,
              width: 500,
              background: "transparent",
              toolbar: {
                show: false,
              },
            },
            stroke: {
              curve: "smooth",
            },
            xaxis: {
              type: "datetime",
              categories: data?.map((price) => price.time_close),
              labels: {
                show: false,
              },
            },
            yaxis: {
              show: false,
            },
            grid: {
              yaxis: {
                lines: {
                  show: false,
                },
              },
            },
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(5)}`,
              },
            },
          }}
        />
      )}
    </h1>
  );
}

export default Chart;
