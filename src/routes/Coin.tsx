import { useEffect, useState } from "react";
import {
  Switch,
  Route,
  useLocation,
  useParams,
  Link,
  useRouteMatch,
} from "react-router-dom";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";

const Container = styled.div`
  padding: 0 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 30px;
  font-weight: 600;
`;

const Loading = styled.div`
  align-items: center;
`;

const Overview = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-radius: 5px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    text-transform: uppercase;
    margin-bottom: 3px;
  }
`;

const Description = styled.p`
  text-align: center;
  margin: 15px 0;
  padding: 0 20px;
  line-height: 1.2;
`;

const Tabs = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  a {
    width: 49%;
  }
`;

const Tab = styled.div<{ isActive: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px 0;
  border-radius: 5px;
  text-transform: uppercase;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
`;

const Result = styled.div`
  margin-top: 20px;
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
}

interface IInfo {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface IPriceInfo {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<IInfo>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<IPriceInfo>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 5000,
    }
  );
  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>RANK</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>SYMBOL</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
          </Overview>
          <Description>
            {infoData?.description
              ? infoData.description
              : "No description provided"}
          </Description>
          <Overview>
            <OverviewItem>
              <span>TOTAL SUPPLY</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Link to={`/${coinId}/price`}>
              <Tab isActive={priceMatch !== null}>Price</Tab>
            </Link>
            <Link to={`/${coinId}/chart`}>
              <Tab isActive={chartMatch !== null}>Chart</Tab>
            </Link>
          </Tabs>

          <Result>
            <Switch>
              <Route path={`/${coinId}/price`}>
                <Price />
              </Route>
              <Route path={`/${coinId}/chart`}>
                <Chart coinId={coinId} />
              </Route>
            </Switch>
          </Result>
        </>
      )}
    </Container>
  );
}

export default Coin;
