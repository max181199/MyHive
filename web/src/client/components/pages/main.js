import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { getQuery, postQuery } from '../../services/query-service'
import { tablesChanged } from './../../actions/tables';
import mainLoadingGif from '../../images/main-loading.gif';
import Header from '../header';
import CodeEditor from "./../code-editor";
import TablesList from "./../tables-list";
import History from "./../history";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Accept from '../acceptTab';

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

const StTabs = styled(Tabs)`
  height : 38px;
  min-height : 38px;
  background-color: rgb(250, 250, 250);
  text-align: center;
  border-bottom: 1px solid rgb(224, 224, 224);
  & .MuiTabs-scrollable{
    display: flex;
    align-items: center;
    justify-content: start;
    margin-bottom: 0px;
  }
`;

const StTab = styled(Tab)`
  border: 1px solid rgb(224, 224, 224);
  color : ${props=>props.clr=='false'?'grey':'#ef5350'};
`;

const Main = ({tables, tablesChanged }) => {
  const [loading, setLoading] = useState(true);
  const [request, set_request ] = useState('');
  const [jobs , set_jobs] = useState([]);
  const [tabs,setTabs] = useState([{
    title : 'Редактор',
    type  : 'redactor',
    new   : 'false',
    drop  : false
  }])

  const getChunk = async (reader) => {
    return(reader.read())
  }

  const getLine = async ( file )=>{
    let stream = file.stream()
    let reader = stream.getReader()
    const utf8Decoder = new TextDecoder("utf-8");
    let myLine = []

    while(true){
      let chn = await getChunk(reader)
      let lines = utf8Decoder.decode(chn.value).split('\n').filter((el)=>el!="")
      for (let index = 0; index < lines.length; index++) {
        if(myLine.length >= 10){
          break;
        } else {
          let tmp = lines[index].split('\t').filter((el)=>{
            return(
              el!="" && el!="\n" && el!=" "
            )
          })
          //console.log(tmp)
          myLine.push(tmp)
        }
      }
      if (myLine.length >= 10 || chn.done){
        break;
      }
    }
    return myLine
  }

  const [value, setValue] = React.useState(0);
  const [previosValue, setPreviosValue ] = React.useState(0);
  const [header_name,set_header_name ] = useState([])
  const [header_type,set_header_type ] = useState([]) 
  const [columns,setColumns] = useState([[]])
  const [accError,setAccError] = useState(false)
  const [alterData,setAlterData] = useState(null)
  

  useEffect(() => {
    (async () => {
      const tables = await getQuery('/getMainInfo');
      tablesChanged(tables);
      const tabel_alter_data = await getQuery('/getAlterTableInfo')
      setAlterData(tabel_alter_data.data)
      //console.log('TEST:::',tabel_alter_data)
      setLoading(false);
    })()
    getJobs()
    let int_id = setInterval( async ()=>{
      const data = await getQuery('/getMainInfo');
      tablesChanged(data);
    },20000)
    let int_id_jobs = setInterval( async ()=>{
      getJobs()
    },10000)
    
    return(()=>{clearInterval(int_id);clearInterval(int_id_jobs)})
  }, []);

 
  const getJobs = () => {
    getQuery('/get_jobs').then((data) => {
      //console.log('FRONT_GET_JOBS_DATA:::', data)
      if (data.state == 'ok') {
        set_jobs(data.rows)
      }
    })
  }

  const changeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=>{
    let tmp = tabs;
    tmp[value].new = 'false'
    if ( (tmp[previosValue] != undefined) && (tmp[previosValue].type == 'accept') ){
      tmp[previosValue].header_name = header_name
      tmp[previosValue].header_type = header_type
    }
    if( tmp[value].type == 'accept' ){
      setColumns([])
      getLine(tmp[value].file).then((data)=>{
        if ( tmp[value].header_name != undefined){
          set_header_name(tmp[value].header_name)
        } else {
          if ( data.length !== 0){
            let res = []
            let index = 1
            for ( let i in data[0] ){
              res.push('Column_' + index)
              index++;
            }
            set_header_name(res)
          } else {
            set_header_name([])
          }
        }
        if ( tmp[value].header_type != undefined){
          set_header_type(tmp[value].header_type)
        } else {
          if ( data.length !== 0){
            let res = []
            let index = 1
            for ( let i in data[0] ){
              res.push('STRING')
              index++;
            }
            set_header_type(res)
          } else {
            set_header_type([])
          }
        }
        setAccError(false)
        setColumns(data)
      })
    }
    setPreviosValue(value)
    setTabs(tmp)
  },[value])

	return (
	  <Root>
	    <Header page="main"/>
	    <Content>
      {
        loading ? <MainLoading /> : 
        <>
        <Tables>
          <Title><TitleText>Таблицы</TitleText></Title>
          <TablesList tabs={tabs} alterData={alterData} setTabs={setTabs} />
        </Tables>
        <Editor >
          <StTabs
            value={value}
            onChange={changeTab}
            variant="scrollable"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            {tabs.map((el,index)=>{
              return(
                <StTab clr={el.new} key={'Tab_' + index + '_' + (el.fulnm == undefined ? el.title : el.fulnm) } label={el.title}/>
              )
            })}
          </StTabs>
          {
            tabs[value].type == 'redactor'
            ?
            <CodeEditor request={request} setRequest={set_request} getJobs={getJobs} />
            :
            null
          }
          {
            tabs[value].type == 'accept'
            ?
            <Accept header_type={header_type} set_header_type={set_header_type} error={accError} setError={setAccError} columns={columns} setColumns={setColumns} header_name={header_name} set_header_name={set_header_name}  tabs={tabs} setTabs={setTabs} value={value} setValue={setValue}/>
            :
            null
          }
        </Editor>
        <HistoryQuery  >
          <Title><TitleText>История запросов</TitleText></Title>
          <History setValue={setValue}  jobs={jobs} getJobs={getJobs} set_request={set_request}/>
        </HistoryQuery>
        </>
      }
	    </Content>
	  </Root>
  )
}


export default connect((store)=>({tables : store.tables}), {tablesChanged})(Main);
