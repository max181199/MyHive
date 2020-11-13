import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

import logoImg from './../images/logo.png'
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import TocIcon from '@material-ui/icons/Toc';

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

const Help = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  right: 30px;
`

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
  border-left: 2px solid white;
  padding: 10px 5px;
  font-weight: bold;
  line-height: 12px;
  margin-left: 5px;
`;

const BoldText = styled(Typography)`
  font-size: 20px;
  padding: 10px 5px;
  font-weight: bold;
  line-height: 12px;
`
const StLink = styled(Link)`
  color : white;
  display: flex;
  align-items: center;
  : hover{
    text-decoration: none;
    & > svg {
      color : white;
    }
  }
  & > svg {
    padding : 0;
    color : #1976d2;
    font-weight: bold;
    margin-right : -8px;
    width: 25px;
    height: 25px;
  }
`

const StIconButton = styled(IconButton)`
  color:white;
  padding : 8px;
  & > span{
    & > svg {
      height : 25px;
      width  : 25px;
    }
  }
`;

const StIconButtonContent = styled(IconButton)`
  color:white;
  padding : 4px;
  margin-left : 10px;
  font-size : 28px;
`;

const Header = ({ page,state,cb}) => {  
  return (
    <Root>
      {
        page === 'main'
        ?
        [
          <Name key='main_name'>
            <Logo></Logo>
            <FullName>Hive Manager</FullName>
          </Name>
          ,
          <Help key='main_help'>
            <Tooltip title="Помощь">
              <StIconButton href='help'>
                <LiveHelpIcon/>
              </StIconButton>
            </Tooltip>
          </Help>
        ]
        :
        null
      }
      {
        page === 'helpPage'
        ?
        <Name key='helpPage_name'>
          <StLink href={`${window.location.protocol}//${window.location.host}`}>
            <ArrowBackIosIcon/>
            <BoldText>
              Вернуться
            </BoldText>
          </StLink>
          {
            state
            ?
            null
            : 
            <StIconButtonContent onClick={()=>{cb(true)}}>
              <TocIcon fontSize='inherit'/>
            </StIconButtonContent>
          }
        </Name>
        : null
      }
    </Root>
  );
};

export default Header;
