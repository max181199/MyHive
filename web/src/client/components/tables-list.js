import React, {useState, Fragment, useEffect} from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
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
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import Badge from '@material-ui/core/Badge';

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
  justify-content: left;
  display : flex;
  flex-grow : 100;
  text-align: center;
  & > label {
    & > span {
      :hover{
        background-color : rgba(130,130,130,0.3) !important;
      }
    }
  }
`;

const SettingsOne = styled.div`
  justify-content: flex-start;
  display : flex;
  flex-grow : 100;
  margin : 0 10px;
  text-align: center;
  & > button {
    :hover{
      background-color : rgba(130,130,130,0.3) !important;
    }
  }
`;

const ListItemBlock = styled(ListItem)`
  padding : 0;
  padding-left: ${props => props.padding || '20px'};
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  cursor: pointer;
  &:hover {
    background-color: rgba(100,100,100,0.1) !important;
  }
  flex: 1;
`;


const MyListItemBlock = styled(ListItem)`
  padding : 0;
  padding-left: ${props => props.padding || '20px'};
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  cursor: pointer;
  &:hover {
    background-color: rgba(100,100,100,0.1) !important;
  }
  flex-grow : 1;
  flex: 1;
`;


const StErrorListItemBlock = styled(ListItemBlock)`
  display : block;
  :hover {
    background-color : white !important;
  }
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
  padding-left : 6px;
`;

const NameSpan = styled.span`
  font-size : 16px;
  padding-left : 6px;
  white-space: nowrap;
`

const NoWrap = styled.span`
  padding-left : 6px;
  white-space: nowrap;
`

const TableName = styled.span`
  padding-left : 6px;
  margin-right : 10px;
  white-space: nowrap;
  display : flex;
  overflow : hidden;
`

const ErrorPlace = styled.div`
  background-color : rgba(200,200,200,0.1);
  width : calc(100% - 40px);
  border : 1px solid lightgrey;
`;

const LoadPlace = styled.div`
  width : calc(100% - 40px);
  border : 1px solid lightgrey;
`;

const MyStIconButton = styled(IconButton)`
  margin : 0 10px;
`;

const DropIconButton = styled(IconButton)`
  color : ${props=>props.clr};
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
  const [deletingTable, setDeletingTable ] = useState([]);
  //console.log('deleting:',deletingTable)

  useEffect(()=>{
    cookies.set('login', 'test-user', { path: '/' });
  },[])

  const saveCSV = (e) =>{
    let files = e.target.files
    //console.log(files);
    let len = files.length
    for (let index = 0; index < len; index++) {
      let file = files[0]
      //console.log(file)
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
    document.getElementById('fileLoader').value = ""
  }

  const addUpload = async (f_name) => {
    let adr = `${window.location.protocol}//${window.location.host}/api/addColumn?name=${f_name}`
    let response = await fetch(adr);
    let result = await response.json();
    return( { id : result.id, name : result.name } )
  }

  const foggot_error = async (name) => {
    await getQuery('/foggot_error',{name})
    const data = await getQuery('/getMainInfo');
    tablesChanged(data);
  }

  const dropTable = async ( name ) => {
    await getQuery('/dropTable',{name})
    const data = await getQuery('/getMainInfo');
    tablesChanged(data);
  }
  

  const renderItem = (item, i, name) => {
    return(
      <Fragment key={`${item.table}_${i}`}>
        <Item>
          <MyListItemBlock padding={`20px`} onClick={() => setMenu(item.table)}>
            {menu[item.table] ? <ExpandLess /> : <ExpandMore />}
            <ListItemText>
              <Tooltip title={item.table} enterDelay={1000} enterNextDelay={1000}>
                <TableName>
                  {item.table}
                </TableName>
              </Tooltip>  
            </ListItemText>
            {
              (name != 'consultant') ?
              <SettingsOne>
                {
                  (!deletingTable.includes(item.table))
                  ?
                    <Tooltip title="Переименовать">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  :
                  null
                }
                <Tooltip title="Удалить таблицу" onClick={(e)=>{setDeletingTable([...deletingTable,item.table]);e.preventDefault();e.stopPropagation();dropTable(item.table)}}>
                  <DropIconButton size="small" clr={deletingTable.includes(item.table)?'#ffc107':'grey' }>
                    <DeleteOutlineIcon />
                  </DropIconButton>
                </Tooltip>
              </SettingsOne> : null
            }
          </MyListItemBlock>
          
        </Item>
        <Collapse in={menu[item.table]} timeout="auto">
        {
          item.columns.map((column, k) => {
            return(
              <ListItemBlock key={`${i}_${k}`} padding={`40px`}>
                <ListItemText>
                  <Tooltip title={`${column.name} (${column.type})`} enterDelay={1000} enterNextDelay={1000}>
                    <TableName>
                      {`${column.name} (${column.type})`}
                    </TableName>
                  </Tooltip>
                </ListItemText>
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
      <Fragment key={`${item.name}`}>
        <Item>
          <StErrorListItemBlock padding={`40px`}  >
            <LoadPlace>
              <ListItemText> 
                <TableName>
                  <NameSpan>
                    Имя файла:
                  </NameSpan>
                  <Tooltip title={item.name} >
                    <NoWrap>
                      {   
                        item.name.replace(/_\d+?$/gi,'').length > 21 
                        ? 
                        ( item.name.replace(/_\d+?$/gi,'').slice(0,21) + '...' ) 
                        :
                        ( item.name.replace(/_\d+?$/gi,'') ) 
                      } 
                    </NoWrap>
                  </Tooltip> 
                </TableName>
                <TableName>
                  <NameSpan>
                    Дата: 
                  </NameSpan>
                  <Tooltip title={moment.unix(item.name.match(/_\d+?$/gi)[0].replace(/_/gi,'') / 1000).format('HH:mm:ss DD-MM-YYYY')}>
                    <NoWrap>
                      {   
                        moment.unix(item.name.match(/_\d+?$/gi)[0].replace(/_/gi,'') / 1000).format('HH:mm:ss DD-MM-YYYY')
                      } 
                    </NoWrap>
                  </Tooltip>
                </TableName>
                <TableName>
                  <Tooltip title={item.state}>
                    <StSpan>
                      {
                        item.state.length > 40 
                        ? 
                        ( item.state.slice(0,40) + '...' ) 
                        :
                        ( item.state ) 
                      }
                    </StSpan>
                  </Tooltip>
                </TableName>
              </ListItemText>
            </LoadPlace>
          </StErrorListItemBlock>
        </Item>
      </Fragment>
    )
  } 

  const renderUserTableError = (item, i) => {
    return(
      <Fragment key={`${item.name}`}>
        <Item>
          <StErrorListItemBlock padding={`40px`}>
            <ErrorPlace>
              <Tooltip title="Удалить уведомление">
                <IconButton size="small" onClick={()=>{foggot_error(item.name)}}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <ListItemText>
                <TableName>
                  <NameSpan>
                    Имя файла:
                  </NameSpan>
                  <Tooltip title={item.name} >
                    <NoWrap>
                      {   
                        item.name.replace(/_\d+?$/gi,'').length > 21 
                        ? 
                        ( item.name.replace(/_\d+?$/gi,'').slice(0,21) + '...' ) 
                        :
                        ( item.name.replace(/_\d+?$/gi,'') ) 
                      } 
                    </NoWrap>
                  </Tooltip> 
                </TableName>
                <TableName>
                  <NameSpan>
                    Дата: 
                  </NameSpan>
                  <Tooltip title={moment.unix(item.name.match(/_\d+?$/gi)[0].replace(/_/gi,'') / 1000).format('HH:mm:ss DD-MM-YYYY')}>
                    <NoWrap>
                      {   
                        moment.unix(item.name.match(/_\d+?$/gi)[0].replace(/_/gi,'') / 1000).format('HH:mm:ss DD-MM-YYYY')
                      } 
                    </NoWrap>
                  </Tooltip>
                  </TableName>
                  <TableName>
                    <Tooltip title={item.state.replace(/error_/gi,'')} >
                      <StSpan>
                        {   
                          item.state.replace(/error_/gi,'').length > 40
                          ? 
                          ( item.state.replace(/error_/gi,'').slice(0,40) + '...' ) 
                          :
                          ( item.state.replace(/error_/gi,'') ) 
                        } 
                      </StSpan>
                    </Tooltip>
                  </TableName>
              </ListItemText>
            </ErrorPlace>
          </StErrorListItemBlock>
        </Item>
      </Fragment>
    )
  } 

	return (
    <Root>
      <ListItemBlock padding={`0px`} onClick={() => setMenu('consultant')}>
        {menu['consultant'] ? <ExpandLess /> : <ExpandMore />}
        <ListItemText>
          <Tooltip title="Consultant" enterDelay={1000} enterNextDelay={1000} >
            <TableName>
              Consultant
            </TableName>
          </Tooltip>
        </ListItemText>
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
        <ListItemText>
          <Tooltip title="Таблицы запросов" enterDelay={1000} enterNextDelay={1000}>
            <TableName>
              Таблицы запросов
            </TableName>
          </Tooltip>
        </ListItemText>
      </ListItemBlock>
      <Collapse in={menu['userbase']} timeout="auto">
      {
        ( tables.userbase || [] ).length == 0 ?
          <EmptyList>
            <Tooltip title="Таблицы отсутствуют" enterDelay={1000} enterNextDelay={1000}>
              <TableName>
                Таблицы отсутствуют
              </TableName>
            </Tooltip>
          </EmptyList> :
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
        <ListItemBlock
          padding={`0px`}
          onClick={() => setMenu('uploaded')}>
          {menu['uploaded'] ? <ExpandLess /> : <ExpandMore />}
          <ListItemText>
            <Tooltip title="Пользовательские таблицы" enterDelay={1000} enterNextDelay={1000} >
              <TableName>
                Пользовательские таблицы
              </TableName>
            </Tooltip>
          </ListItemText>
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
                <MyStIconButton component= 'span' size="small">
                  <AddIcon/>
                </MyStIconButton>
              </Tooltip>
            </label> 
          </Settings>
        </ListItemBlock> 
      </Item>
      <Collapse in={menu['uploaded']} timeout="auto">
        <ListItemBlock key={'wait'} padding={`20px`} onClick={() => setMenu('wait')}>
          {menu['wait'] ? <ExpandLess /> : <ExpandMore />}
          <ListItemText>
            <Tooltip title={`Загрузка: ${( tables.wait || [] ).filter((el)=>!el.state.startsWith('error_')).length}`} enterDelay={1000} enterNextDelay={1000}>
              <TableName>
                {`Загрузка: ${( tables.wait || [] ).filter((el)=>!el.state.startsWith('error_')).length}`}
              </TableName>
            </Tooltip>
          </ListItemText>
        </ListItemBlock>
        <Collapse key={'wait_collaps'} in={menu['wait']} timeout="auto">
        {
          ( tables.wait || [] ).length == 0 ?
          null :
          ( tables.wait || [] )
          .filter((el)=>!el.state.startsWith('error_'))
          .map((item,i) => {
            return renderDisableItem(item,i)
          })
        }
        </Collapse>
        <ListItemBlock key={'wait_error'} padding={`20px`} onClick={() => setMenu('wait_error')}>
          {menu['wait_error'] ? <ExpandLess /> : <ExpandMore />}
          <ListItemText>
          <Tooltip title={`Ошибки: ${( tables.wait || [] ).filter((el)=>el.state.startsWith('error_')).length}`} enterDelay={1000} enterNextDelay={1000}>
            <TableName>
              {`Ошибки: ${( tables.wait || [] ).filter((el)=>el.state.startsWith('error_')).length}`}
            </TableName>
          </Tooltip>
          </ListItemText> 
        </ListItemBlock>
        <Collapse key={'wait_error_collaps'} in={menu['wait_error']} timeout="auto">
        {
          ( tables.wait || [] ).length == 0 ?
          null :
          ( tables.wait || [] )
          .filter((el)=>el.state.startsWith('error_'))
          .map((item,i) => {
            return renderUserTableError(item,i)
          })
        }
        </Collapse>
        {
          ( tables.uploaded || [] ).length == 0 ?
            <EmptyList>
              <Tooltip title="Таблицы отсутствуют" enterDelay={1000} enterNextDelay={1000}>
                <TableName>
                  Таблицы отсутствуют
                </TableName>
              </Tooltip>
            </EmptyList> :
          <>
          {
            ( tables.uploaded || [] ).map((item,i) => {
              return renderItem(item,i,'uploaded')
            })
          }
          </>
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
