import React, {useState, Fragment, useEffect} from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { Divider } from '@material-ui/core';

import { tablesChanged } from './../actions/tables';

import { Typography } from '@material-ui/core';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

import Tooltip from '@material-ui/core/Tooltip';
import { ListSubheader } from '@material-ui/core';
import { getQuery } from '../services/query-service';

const Root = styled.div`
  width: 100%;
  height: 100vh;
`;

const EmptyList = styled(Typography)`
  width: 100%;
  padding: 5px 30px; 
  color: rgba(0, 0, 0, 0.54)
`;

const Item = styled.div`
  display: flex;
  align-items: center;
`;

const Settings = styled.div`
  width: calc( 100% - 242px );
  padding: 0px;
  text-align: center;
`;

const ListItemBlock = styled(ListItem)`
  padding : 0;
  padding-left: ${props => props.padding || '20px'};
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  cursor: pointer;
  &:hover {
    background-color: #e8e8e8;
  }
  flex: 1;
`;

const SETListItemBlock = styled(ListItem)`
  padding : 0;
  max-width : 242px;
  padding-left: ${props => props.padding || '20px'};
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  cursor: pointer;
  &:hover {
    background-color: #e8e8e8;
  }
  flex: 1;
`;

const StIconButton = styled(IconButton)`
  padding : 0;
`;

const StListItemBlock = styled(ListItemBlock)`
  display : block;
  lineheight : 1;
`

const Purp = styled.span`
  color : #9c27b0;
`;

const Red = styled.span`
  color : #f44336;
`;

const cookies = new Cookies();

const TablesList = ({tables, tablesChanged}) => {
  const [menu, onMenuChange] = useState({});
  const setMenu = (name) => {
    onMenuChange({
      ...menu,
      [name]: (menu[name] == undefined) ? true : !menu[name] 
    });
  }

  useEffect(()=>{
    getDisableName().then((res)=>tablesChanged({...tables,wait : res}))
    setInterval(()=>{
      getDisableName().then((res)=>tablesChanged({...tables,wait : res}))
    },60000)
  },[])

  useEffect(()=>{
    cookies.set('login', 'admin', { path: '/' });
  },[])

  const saveCSV = (e) =>{
    let file = e.target.files[0]
    addUpload(file.name).then( (res)=>sendCSV(file,res)) 
  }

  const addUpload = async (f_name) => {
    let adr = `${window.location.protocol}//${window.location.host}/api/addColumn?name=${f_name}`
    let response = await fetch(adr);
    let result = await response.json();
    return( result.id )
  }

  const getDisableName = async () => {
    let adr = `${window.location.protocol}//${window.location.host}/api/getDisable`
    let response = await fetch(adr);
    let result = await response.json();
    return( result.names )
  }

  const sendCSV = async ( csv , id ) => {
    const data = new FormData()
    data.append( 'csv_file', csv , csv.name ) 
    data.append('id',id)
    let apiBase = `${window.location.protocol}//${window.location.host}/api`
    let response = await fetch(apiBase+'/uploadCSV', {
        method: 'POST',
        body: data
    });
    let result = await response.json();
    console.log('RESULT:::',result)
}

  const renderItem = (item, i, name) => {
    return(
      <Fragment key={`${item.table}_${i}`}>
        <Item>
          <ListItemBlock padding={`30px`} onClick={() => setMenu(item.table)}>
            {menu[item.table] ? <ExpandLess /> : <ExpandMore />}
            <ListItemText primary={item.table} />
          </ListItemBlock>
          {
            (name != 'consultant') ?
            <Settings>
              <Tooltip title="Переименовать">
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Удалить таблицу">
                <IconButton size="small">
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            </Settings> : null
          }
        </Item>
        <Collapse in={menu[item.table]} timeout="auto">
        {
          item.columns.map((column, k) => {
            return(
              <ListItemBlock key={`${i}_${k}`} padding={`60px`}>
                <ListItemText primary={`${column.name} (${column.type})`} />
              </ListItemBlock>
            )
          })
        }
        </Collapse>
      </Fragment>
    )
  } 


  const renderDisableItem = (item, i) => {
    return(
      <Fragment key={`${item.name}_${i}`}>
        <Item>
          <StListItemBlock  padding={`20px`}>
          <ListItemText> {   item.name.length > 21 ? ( 'Имя: ' + item.name.slice(0,21) + '...' ) :('Имя: ' + item.name ) } <br/> {'Состояние: ' + item.state}  </ListItemText>
          </StListItemBlock>
        </Item>
      </Fragment>
    )
  } 


	return (
    <Root>
      <ListItemBlock padding={`0px`} onClick={() => setMenu('consultant')}>
        {menu['consultant'] ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary="consultant" />
      </ListItemBlock>
      <Collapse in={menu['consultant']} timeout="auto">
      {
        ( tables.consultant || []).map((item,i) => {
          return renderItem(item,i,'consultant')
        })
      }
      </Collapse>

      <ListItemBlock
        padding={`0px`}
        onClick={() => setMenu('userbase')}>
        {menu['userbase'] ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary="Таблицы запросов" />
      </ListItemBlock>
      <Collapse in={menu['userbase']} timeout="auto">
      {
        ( tables.userbase || [] ).length == 0 ?
          <EmptyList>Таблицы отсутствуют</EmptyList> :
        <>
        {
          tables.userbase.map((item,i) => {
            return renderItem(item,i,'userbase')
          })
        }
        </>
      }
      </Collapse>

      <Item>
        <SETListItemBlock
          padding={`0px`}
          onClick={() => setMenu('uploaded')}>
          {menu['uploaded'] ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary="Пользовательские таблицы" />
        </SETListItemBlock>
        <Settings>
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="fileLoader"
            multiple={false}
            type="file"
            onChange={saveCSV}
          />
          <label htmlFor="fileLoader">
            <Tooltip title="Добавить таблицу">
              <StIconButton component= 'span' size="small">
                <AddIcon/>
              </StIconButton>
            </Tooltip>
          </label> 
        </Settings> 
      </Item>
      <Collapse in={menu['uploaded']} timeout="auto">
      {
        ( tables.uploaded || [] ).length == 0 ?
          <EmptyList>Таблицы отсутствуют</EmptyList> :
        <>
        {
          ( tables.uploaded || [] ).map((item,i) => {
            return renderItem(item,i,'uploaded')
          })
        }
        </>
      }
      </Collapse>

      <ListItemBlock padding={`0px`} onClick={() => setMenu('wait')}>
        {menu['wait'] ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary="В обработке" />
      </ListItemBlock>
      <Collapse in={menu['wait']} timeout="auto">
      {
        ( tables.wait || [] ).length == 0 ?
        null :
        ( tables.wait || [] ).map((item,i) => {
          return renderDisableItem(item,i)
        })
      }
      </Collapse>


    </Root>
  )
}

const mapStateToProps = ({ tables }) => {
  return { tables };
};

const mapDispatchToProps = {
  tablesChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(TablesList);
