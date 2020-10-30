import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CodeIcon from '@material-ui/icons/Code';
import ReplyAllIcon from '@material-ui/icons/ReplyAll';
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import { getQuery, postQuery } from '../services/query-service'

const Root = styled.div`
  flex: 1;
`;

const HistoryItemWrapper = styled.div`
  padding: 10px;
  border-bottom: 1px solid rgb(224, 224, 224);
`;

const Progress = styled(LinearProgress)`
  margin: 10px 0;
`;

const Settings = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const SettingsBtn = styled(IconButton)`
  margin-right: 15px;
`;

const History = ({ request,set_request, send_button }) => {

  const [jobs, set_jobs] = useState([])
  const [block, set_block] = useState(false)

  useEffect(() => {
    getJobs()
  }, [])

  useEffect(() => {
    if (block) {
      createJob(request)
    } else {
      set_block(true)
    }
  }, [send_button])

  const getJobStatus = async (job_id) => {
    let tmp = await getQuery('/get_job_status', { job_id })
      .then((data) => {
        console.log('FRONT_GET_JOB_STATUS_DATA:::', { job_id, data })
        if (data.state == 'ok') {
          return (data.status)
        } else {
          return ('*ERROR*')
        }
      })
      return(tmp)
  }

  const getJobs = () => {
    getQuery('/get_jobs').then((data) => {
      console.log('FRONT_GET_JOBS_DATA:::', data)
      if (data.state == 'ok') {
        jobs.forEach((el) => {
          if (el.timer !== undefined) {
            clearInterval(el.timer)
          }
        })
        set_jobs(data.rows)
      }
    })
  }

  const killJob = (job_id,state) => {
    getQuery('/forgot_job',{job_id}).then((data) => {
      if ( data.state == 'ok' ){
        getJobs()
        if ( state === 'RUNNING' ){
          getQuery('/kill_job',{job_id}).then((data) =>{
            if (data.state !== 'ok'){
              console.log('FRONT_KILL_JOB_ERROR')
            }
          })
        }
      } else {
        console.log('FRONT_FORGOT_JOB_ERROR')
      }
    })
  }

  const createJob = (user_req) => {
    postQuery('/create_hive_job', { user_req }).then((data) => {
      console.log('FRONT_CREATE_JOB_DATA:::', data)
      if (data.state == 'ok') {
        getJobs()
      }
    })
  }

  /// Вынести в отдельный файл
  const HistoryItem = (el) => {

      const time = setTimeout(async ()=>{
        word = await getJobStatus(el.job_id)
        console.log('HearMe',word)
      },2000)

    return (
      <HistoryItemWrapper key={'HISTORY_ITEM' + el.date} >
        <Typography><strong>Дата:</strong> {moment(el.date).format('DD.MM.YYYY HH:mm:ss')}</Typography>
        <Typography>
          <strong>Статус: </strong>
          <span>{`Выполнение (${word}%)`}</span>
        </Typography>
        <Progress variant="determinate" value={0} />
        <Settings>
          <Tooltip title="Текст запроса">
            <SettingsBtn size="small">
              <CodeIcon />
            </SettingsBtn>
          </Tooltip>
          <Tooltip title="Перенести текст">
            <SettingsBtn onClick={()=>{set_request(el.request)}} size="small">
              <ReplyAllIcon />
            </SettingsBtn>
          </Tooltip>
          <Tooltip onClick={()=>{console.log('LATER_BE_WORK')}} title="Сохранить результат">
            <SettingsBtn size="small">
              <SaveIcon />
            </SettingsBtn>
          </Tooltip>
          <Tooltip onClick={()=>{killJob(el.job_id,el.state)}} title="Удалить запрос">
            <SettingsBtn size="small">
              <DeleteOutlineIcon />
            </SettingsBtn>
          </Tooltip>
        </Settings>
      </HistoryItemWrapper>
    )
  }
  

  return (
    <Root>
      {jobs.map( (el)=>{
        return(HistoryItem(el))
      })}
    </Root>
  )
}



export default History;
