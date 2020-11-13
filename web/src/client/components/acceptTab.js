import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { Input } from '@material-ui/core';

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

const StTableCell = styled(TableCell)`
  border : 1px solid lightgrey;
  min-width: 150px;
  text-align: center;
`;

const StFormControl = styled(FormControl)`
  width: 100%;
  & > div{
    &:hover {
      &:before {
        border-bottom-color: #1e88e5 !important;
      }
    }
    &:after {
      border-bottom-color: ${props=>props.blcerr=='true'?'red':'#1e88e5'};
    }
    &:before {
      border-bottom-color: ${props=>props.blcerr=='true'?'red':'grey'};
    }
  }
`

const Accept = ({ header_type,set_header_type,error,setError,columns,setColumns, header_name, set_header_name, tabs,setTabs,value,setValue})=>{
  
//console.log('CLMNS:::',columns)
//console.log('HEADER:::',header_name)
  
const sendCSV = async ( csv , obj,h_t,h_n ) => {
  const data = new FormData()
  data.append( 'csv_file', csv , obj.name ) 
  data.append('id',obj.id)
  data.append('header_type',h_t)
  data.append('header_name',h_n)
  let apiBase = `${window.location.protocol}//${window.location.host}/api`
  let response = await fetch(apiBase+'/uploadCSV', {
      method: 'POST',
      body: data
  });
  let result = await response.json();
  console.log('RESULT__:::',result)
}

const send = ()=>{
  sendCSV(tabs[value].file,tabs[value].res,header_type,header_name)
  setValue(value-1)
  let tmp = [...tabs.slice(0,value),...tabs.slice(value+1,tabs.length)]
  setTabs(tmp)
}

const close = ()=>{
  setValue(value-1)
  let tmp = [...tabs.slice(0,value),...tabs.slice(value+1,tabs.length)]
  setTabs(tmp)
}

const header_name_maper = (text,index)=>{
  let blcerr = 'false'
  header_name.forEach((el,ind)=>{
    if (el==text & ind !== index){
      blcerr='true'
    }
  })
  if (blcerr == 'true'){
    if(error){}else{
      setError(true)
    }
  }
  return(
    <StTableCell key={'COLUMN_HEADER_NAME'  + index }>
      <StFormControl blcerr={blcerr} >
        <Input 
          value={text}
          onChange={(e)=>{
            const value = e.target.value;
            if (value.slice(-1) === ' ') return;
            let tmp = header_name
            setError(false)
            tmp[index] = value
            set_header_name([...tmp])
          }}  
        />
      </StFormControl>
    </StTableCell>  
  )
}

const header_type_mapper = (type,index) => {
  return(
    <StTableCell key={'COLUMN_HEADER_TYPE'  + index }>
      <StFormControl>
        <Input 
          value={type}
          onChange={(e)=>{
            const value = e.target.value;
            let tmp = header_type
            tmp[index] = value
            set_header_type([...tmp])
          }}  
        />
      </StFormControl>
    </StTableCell>  
  )
}


const columnsMapper = (text,in1,in2) => {
  return(
    <StTableCell key={'COLUMN_BODY'  + '_' + in1 + '_' + in2  }>
      {text}
    </StTableCell>  
  )
}

const rowMapper = (row,index) => {
  return(
    <TableRow key={'ROW' + index}>
      { row.map((el,ind)=>columnsMapper(el,ind,index))}
    </TableRow>
  )
}

return(
  <Root>
    <Settings key={'SETTING'}>
      {
        error 
        ?
        null
        :
        <Tooltip title="Отправить" key={'SETTING_SEND'}>
          <IconButton size="small" onClick={()=>{send()}}>
            <SendIcon/>
          </IconButton>
        </Tooltip>
      }
      <Tooltip title="Отменить">
        <IconButton size="small" onClick={()=>{close()}}>
            <CloseIcon/>
        </IconButton>
      </Tooltip>
      {
        error
        ?
        <TitleText>
          <span>Столбцы с одинаковым именем </span>
        </TitleText>
        :
        <TitleText>
          <span>Полное имя: </span>
          <span>{tabs[value].fulnm}</span>
        </TitleText>
      }
    </Settings>
    <TablePlace>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {header_name.map((el,index)=>header_name_maper(el,index))}
            </TableRow>
            <TableRow>
              {header_type.map((el,index)=>header_type_mapper(el,index))}
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map((el,ind)=> rowMapper(el,ind))}
          </TableBody>
        </Table>
      </TableContainer>
    </TablePlace>
  </Root>
)
} 

export default Accept