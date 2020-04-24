import React from 'react';
import styled from 'styled-components';

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const Cell = styled.div`
  width: 25px;
  height: 25px;
  background-color: ${(props) => props.theme.color};
  cursor: pointer;
  margin: 5px;
`;
export const ColorCode = (props) => {
  // eslint-disable-next-line react/prop-types
  const { onClick } = props;
  const color = getRandomColor();
  return <Cell theme={{ color }} onClick={() => onClick(color)} />;
};
