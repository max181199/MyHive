import React, {useState, Fragment} from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

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

const Root = styled.div`
  width: 100%;
  height: 100vh;
`;

const EmptyList = styled(Typography)`
  width: 100%;
  padding: 5px 25px; 
  color: rgba(0, 0, 0, 0.54)
`;

const Item = styled.div`
  display: flex;
  align-items: center;
`;

const Settings = styled.div`
  width: auto;
  padding: 0 10px;
`;

const ListItemBlock = styled(ListItem)`
  padding: 5px;
  padding-left: ${props => props.padding || '20px'};
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  cursor: pointer;
  &:hover {
    background-color: #e8e8e8;
  }
  flex: 1;
`;

const TablesList = ({tables, tablesChanged}) => {
  const [menu, onMenuChange] = useState({});
  const setMenu = (name) => {
    onMenuChange({
      ...menu,
      [name]: (menu[name] == undefined) ? true : !menu[name] 
    });
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

	return (
    <Root>
      <ListItemBlock padding={`0px`} onClick={() => setMenu('consultant')}>
        {menu['consultant'] ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary="consultant" />
      </ListItemBlock>
      <Collapse in={menu['consultant']} timeout="auto">
      {
        tables.consultant.map((item,i) => {
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
        tables.userbase.length == 0 ?
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
        <ListItemBlock
          padding={`0px`}
          onClick={() => setMenu('uploaded')}>
          {menu['uploaded'] ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary="Пользовательские таблицы" />
        </ListItemBlock>
        <Settings>
          <Tooltip title="Добавить таблицу">
            <IconButton size="small">
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Settings> 
      </Item>
      <Collapse in={menu['uploaded']} timeout="auto">
      {
        tables.uploaded.length == 0 ?
          <EmptyList>Таблицы отсутствуют</EmptyList> :
        <>
        {
          tables.uploaded.map((item,i) => {
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
