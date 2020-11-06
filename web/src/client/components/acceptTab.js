import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';

const Root = styled.div`
  flex: 1;
`;



const Settings = styled.div`
  background-color: rgb(250, 250, 250);
  border-bottom: 1px solid rgb(224, 224, 224);
  padding: 7px;
  max-height: 45px;
  display : flex;
  align-items: center;
`;

const TitleText = styled(Typography)`
  font-size: 18px;
  padding-left : 10px;
`;

const TablePlace = styled.div`
  background-color: rgb(255, 255, 255);
  height : auto;
  width : auto;
  margin : 0;
  padding : 0;
  overflow-x : auto;
  overflow-y : auto;
`;

const Accept = ({tabs,setTabs,value,setValue})=>{

const sendCSV = async ( csv , obj ) => {
  const data = new FormData()
  data.append( 'csv_file', csv , obj.name ) 
  data.append('id',obj.id)
  let apiBase = `${window.location.protocol}//${window.location.host}/api`
  let response = await fetch(apiBase+'/uploadCSV', {
      method: 'POST',
      body: data
  });
  let result = await response.json();
  console.log('RESULT__:::',result)
}

const send = ()=>{
  //sendCSV(tabs[value].file,tabs[value].res)
  setValue(value-1)
  let tmp = [...tabs.slice(0,value),...tabs.slice(value+1,tabs.length)]
  setTabs(tmp)
}

const close = ()=>{
  setValue(value-1)
  let tmp = [...tabs.slice(0,value),...tabs.slice(value+1,tabs.length)]
  setTabs(tmp)
}

return(
  <Root>
    <Settings>
      <Tooltip title="Отправить">
        <IconButton size="small" onClick={()=>{send()}}>
            <SendIcon/>
        </IconButton>
      </Tooltip>
      <Tooltip title="Отменить">
        <IconButton size="small" onClick={()=>{close()}}>
            <CloseIcon/>
        </IconButton>
      </Tooltip>
      <TitleText>
        <span>Полное имя: </span>
        <span>{tabs[value].fulnm}</span>
      </TitleText>
    </Settings>
    <TablePlace>
      <p>It'was intresting</p>
    </TablePlace>
  </Root>
)
} 

export default Accept