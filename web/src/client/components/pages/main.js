import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { getQuery } from './../../services/query-service';

import { tablesChanged } from './../../actions/tables';

import mainLoadingGif from '../../images/main-loading.gif';


import Header from '../header';

import CodeEditor from "./../code-editor";
import TablesList from "./../tables-list";

import History from "./../history";

const Root = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgb(245, 245, 245);
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 50px);
`;

const Editor = styled.div`
  width: 52%;
  margin-right: 1%;
  display: flex;
  flex-direction: column;
  height: calc(100% - 50px);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
`;

const Title = styled.div`
  background-color: rgb(250, 250, 250);
  text-align: center;
  border-bottom: 1px solid rgb(224, 224, 224);
  padding: 5px;
`;

const TitleText = styled(Typography)`
  font-size: 18px;
`;

const Tables = styled.div`
  width: 22%;
  margin-right: 1%;
  display: flex;
  flex-direction: column;
  height: calc(100% - 50px);
  overflow-y: auto;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
`;

const MainLoading = styled.div`
  width: 128px;
  height: 116px;
  background-image: url(${mainLoadingGif});
  background-size: cover;
`;

const HistoryQuery = styled.div`
  width: 22%;
  background-color: white;
  display: flex;
  flex-direction: column;
  height: calc(100% - 50px);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
`;

const Main = ({ tablesChanged }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async() => {
      const tables = await getQuery({url: '/getMainInfo'});
      tablesChanged(tables);
      setLoading(false);
    })()
  }, []);

	return (
	  <Root>
	    <Header page="main"/>
	    <Content>
      {
        loading ? <MainLoading /> : 
        <>
        <Tables>
          <Title><TitleText>Таблицы</TitleText></Title>
          <TablesList />
        </Tables>
        <Editor>
          <Title>
            <TitleText>Запрос</TitleText>
          </Title>
          <CodeEditor />
        </Editor>
        <HistoryQuery>
          <Title><TitleText>История запросов</TitleText></Title>
          <History />
        </HistoryQuery>
        </>
      }
	    </Content>
	  </Root>
  )
}

const mapDispatchToProps = {
  tablesChanged
};

export default connect(null, mapDispatchToProps)(Main);
