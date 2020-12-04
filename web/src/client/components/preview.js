import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getQuery } from '../services/query-service';



const Root = styled.div`
  flex: 1;
`;

const Circular = styled(CircularProgress)`
  margin : 100px;
`;

const LoadPlace = styled.div`
  height : 70%;
  width  : 100%;
  lign-content: center;
  justify-content: center;
  display: flex;
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

const NoWrap = styled.span`
  white-space: nowrap;
`

const Preview = ({tabs,setTabs,value,setValue}) => {

  const close = ()=>{
    setValue(value-1)
    let tmp = [...tabs.slice(0,value),...tabs.slice(value+1,tabs.length)]
    setTabs(tmp)
  }

  const [ rows , setRows ] = useState([])
  const [ load , setLoad ] = useState(true)

  useEffect(()=>{
    setLoad(true)
    getQuery('/preview',{name : tabs[value].fulnm , base : tabs[value].base})
    .then( res => {
      //console.log(res)
      setRows(res.data)
      setLoad(false)
    })
  },[value])

  const header_name_maper = (obj,index,name)=>{
    return(
      <StTableCell key={'COLUMN_HEADER_NAME'  + index + name }>
        <NoWrap>
          {obj.name}
        </NoWrap>
      </StTableCell>  
    )
  }
  
  const header_type_mapper = (obj,index,name) => {
    return(
      <StTableCell key={'COLUMN_HEADER_TYPE'  + index + name }>
        <NoWrap>
          {obj.type}
        </NoWrap>
      </StTableCell>  
    )
  }

  const rowMapper = (row,index,name) => {
    return(
      <TableRow key={'ROW' + index + name}>
        { row.split('\t').map((el,ind)=>columnsMapper(el,ind,index,name))}
      </TableRow>
    )
  }

  const columnsMapper = (text,in1,in2,name) => {
    return(
      <StTableCell key={'COLUMN_BODY'  + '_' + in1 + '_' + in2 + '_' + name }>
        {text}
      </StTableCell>  
    )
  }

  return(
    <Root key={tabs[value].fulnm}>
      <Settings key={tabs[value].fulnm + '_SETTING_'}>
        {
          tabs[value].actual == 'true'
          ?
          <Tooltip title="Скачать">
            <a href={`/api/download?name=${tabs[value].fulnm}&base=${tabs[value].base}`} download>
              <IconButton size="small" download={true} >
                <GetAppIcon/>
              </IconButton>
            </a>
          </Tooltip>
          :
          null
        }
        <Tooltip title="Закрыть">
          <IconButton size="small" onClick={()=>{close()}}>
            <CloseIcon/>
          </IconButton>
        </Tooltip>
        <TitleText>
          {
            tabs[value].actual == 'false'
            ?
            <span>Таблицы больше не существует</span>
            :
            [
              <span key='table_name'>Полное имя: </span>,
              <span key='table_name_value'>{tabs[value].fulnm}</span>
            ]
          }
        </TitleText>
      </Settings>
      {
        load
        ?
        <LoadPlace key={'load_place'}>
          <Circular key={'circum'} size={150} />
        </LoadPlace>
        :
        <TablePlace key={tabs[value].fulnm + 'table_place'}>
          <TableContainer key={tabs[value].fulnm + 'table_container'}>
            <Table size="small" key={tabs[value].fulnm + 'table'}>
              <TableHead key={tabs[value].fulnm + 'table_head'} >
                <TableRow key={tabs[value].fulnm + 'table_head_row_one'}>
                  {tabs[value].columns.map((el,index)=>header_name_maper(el,index,tabs[value].fulnm))}
                </TableRow>
                <TableRow key={tabs[value].fulnm + 'table_head_row_two'}>
                  {tabs[value].columns.map((el,index)=>header_type_mapper(el,index,tabs[value].fulnm))}
                </TableRow>
              </TableHead>
              <TableBody key={tabs[value].fulnm + 'table_body'}>
                {rows.map((el,ind)=> rowMapper(el,ind,tabs[value].fulnm))}
              </TableBody>
            </Table>
          </TableContainer>
        </TablePlace>
      }
    </Root>
  )
}

export default Preview