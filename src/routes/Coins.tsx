import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";

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
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 30px;
  font-weight: 600;
`;

const CoinsList = styled.ul``;

const Img = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 8px;
`;

const Coin = styled.li`
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  display: flex;
  align-items: center;
  height: 50px;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 600;
  padding-left: 10px;
  border-radius: 5px;
`;

const Loading = styled.div`
  align-items: center;
`;

interface ICoins {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const { isLoading, data } = useQuery<ICoins[]>("allCoins", fetchCoins);
  return (
    <Container>
      <Helmet>
        <title>Coins List</title>
      </Helmet>
      <Header>
        <Title>Coins List</Title>
      </Header>
      {isLoading ? (
        <Loading>Loading...</Loading>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Link
              to={{
                pathname: `/${coin.id}`,
                state: {
                  name: coin.name,
                },
              }}
            >
              <Coin key={coin.id}>
                <Img
                  src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Coin>
            </Link>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
