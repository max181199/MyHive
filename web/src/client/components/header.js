import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

import logoImg from './../images/logo.png'

const Root = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  width: 100%;
  background-color: #1976d2;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);
  color: #fff;
  position: relative;
`;

const Name = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  left: 30px;
`;

const Logo = styled.div`
  background-image: url(${logoImg});
  width: 40px;
  height: 40px;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
`;

const FullName = styled(Typography)`
  font-size: 20px;
  border-left: 1px solid white;
  padding: 10px 5px;
  font-weight: bold;
  line-height: 12px;
  margin-left: 5px;
`;

const Header = ({ page }) => {
  return (
    <Root>
      <Name>
        <Logo></Logo>
        <FullName>Hive Manager</FullName>
      </Name>
    </Root>
  );
};

export default Header;
