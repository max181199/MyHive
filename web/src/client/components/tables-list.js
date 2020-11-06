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
  padding: 5px 20px; 
  color: rgba(0, 0, 0, 0.54)
`;

const Item = styled.div`
  display: flex;
  align-items: center;
`;

const Settings = styled.div`
  width: calc( 100% - 242px );
  justify-content: center;
  padding: 0px;
  display : flex;
  text-align: center;
`;

const SettingsOne = styled.div`
  width: calc( 100% - 232px );
  justify-content: center;
  padding: 0px;
  display : flex;
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
  & > div{
    & > span{
      line-height : 1.4;
      padding: 4px 0px;
    }
  }
`

const StSpan = styled.span`
  color : grey;
  font-size : 14px;
  padding-left : 10px;
`;

const cookies = new Cookies();

const TablesList = ({tabs,setTabs,tables, tablesChanged}) => {
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
    cookies.set('login', 'test_user', { path: '/' });
  },[])

  const saveCSV = (e) =>{
    let file = e.target.files[0]
    //console.log(file);
    addUpload(file.name).then( (res)=>{setTabs([...tabs,{
      title : file.name.length > 10 ? (file.name.slice(0,9) + '...') : file.name,
      fulnm : file.name,
      type  : 'accept',
      new   : 'true',
      drop  : true,
      file  : file,
      res   : res
    }])} ) 
  }

  const addUpload = async (f_name) => {
    let adr = `${window.location.protocol}//${window.location.host}/api/addColumn?name=${f_name}`
    let response = await fetch(adr);
    let result = await response.json();
    return( { id : result.id, name : result.name } )
  }

  const getDisableName = async () => {
    let adr = `${window.location.protocol}//${window.location.host}/api/getDisable`
    let response = await fetch(adr);
    let result = await response.json();
    return( result.names )
  }

  

  const renderItem = (item, i, name) => {
    return(
      <Fragment key={`${item.table}_${i}`}>
        <Item>
          <ListItemBlock padding={`20px`} onClick={() => setMenu(item.table)}>
            {menu[item.table] ? <ExpandLess /> : <ExpandMore />}
            <ListItemText primary={item.table.length > 21 ? (item.table.slice(0,18)+'...') : item.table } />
          </ListItemBlock>
          {
            (name != 'consultant') ?
            <SettingsOne>
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
            </SettingsOne> : null
          }
        </Item>
        <Collapse in={menu[item.table]} timeout="auto">
        {
          item.columns.map((column, k) => {
            return(
              <ListItemBlock key={`${i}_${k}`} padding={`40px`}>
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
            <ListItemText> 
              {   
                item.name.length > 21 
                ? 
                ( 'Имя: ' + item.name.slice(0,21) + '...' ) 
                :
                ('Имя: ' + item.name ) 
              } 
              <br/>
              <StSpan>
                {
                  item.state
                }
              </StSpan>
            </ListItemText>
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
