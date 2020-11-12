import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';
import LineFileReader from 'line-file-reader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
  min-width: 200px;
  text-align: center;
`;

const StFormControl = styled(FormControl)`
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
  sendCSV(tabs[value].file,tabs[value].res)
  setValue(value-1)
  let tmp = [...tabs.slice(0,value),...tabs.slice(value+1,tabs.length)]
  setTabs(tmp)
}

const close = ()=>{
  setValue(value-1)
  let tmp = [...tabs.slice(0,value),...tabs.slice(value+1,tabs.length)]
  setTabs(tmp)
}


const getLine = async ( file  )=>{
  const reader = new LineFileReader(file)
  const async_iterator = reader.iterate('\n',4096)
  let myLine = []
  let count = 10;
  for await (const line of async_iterator) {
    count--;
    myLine.push(line.split(', '))
    if (count == 0) break;
  }
  return myLine
}

const [columns,setColumns] = useState([[]])
const [error,setError] = useState(false)
const [header_name,set_header_name ] = useState([])
const [prev,setPrev] = useState(value)

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
    <StTableCell key={'COLUMN_HEADER'  + index }>
      <StFormControl blcerr={blcerr} >
        <Input 
          value={text}
          onChange={(e)=>{
            let tmp = header_name
            setError(false)
            tmp[index] = e.target.value
            set_header_name([...tmp])
          }}  
        />
      </StFormControl>
    </StTableCell>  
  )
}

useEffect(()=>{
  tabs[prev].header_name = header_name
  setTabs([...tabs])
  setPrev(value)
  getLine(tabs[value].file).then(data=>setColumns(data))
},[value])

useEffect(()=>{
  getLine(tabs[value].file).then(data=>setColumns(data))
},[])

useEffect(()=>{
  if(tabs[value].header_name != undefined){
    set_header_name(tabs[value].header_name)
  } else {
    let result = []
    for (let i = 0; i <= columns[0].length; i++){
      result.push( 'Column' + i)
    } 
    set_header_name(result)
  }
},[columns])

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
          </TableHead>
        </Table>
      </TableContainer>
    </TablePlace>
  </Root>
)
} 

export default Accept