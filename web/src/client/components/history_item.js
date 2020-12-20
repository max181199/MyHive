import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getQuery, postQuery } from '../services/query-service'
import { Typography } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CodeIcon from '@material-ui/icons/Code';
import ReplyAllIcon from '@material-ui/icons/ReplyAll';
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

const HistoryItemWrapper = styled.div`
  padding: 10px;
  border-bottom: 1px solid rgb(224, 224, 224);
`;

const Progress = styled(LinearProgress)`
  margin: 10px 0;
  & > div{
    background-color : ${props => props.mycolor};
  }
`;

const Settings = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const SettingsBtn = styled(IconButton)`
  margin-right: 15px;
`;

const HistoryItem = (el,setupVNE,getJobs,set_request,setValue)=>{

  let setup = setupVNE === undefined ? {
    color : '#2196f3',
    word  : 'Узнаем состояние',
    percent : 100,
  } : setupVNE;

  const getJobStatus = async (job_id) => {
    let tmp = await getQuery('/get_job_status', { job_id })
      .then((data) => {
        if (data.state == 'ok') {
          return (data.status)
        } else {
          return ('*ERROR*')
        }
      })
      return(tmp)
  }
  
  const killJob =  (job_id) => {
    getQuery('/forgot_job',{job_id}).then( async (data) => {
      if ( data.state == 'ok' ){
        let res = await getJobStatus(job_id)
        getJobs()
        if ( res.state === 'RUNNING' || res.state === 'ACCEPTED' || res.state === 'PREP' ){
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

  return (
    <HistoryItemWrapper key={'HISTORY_ITEM' + el.date} >
      <Typography><strong>Дата:</strong> {moment(el.date).format('DD.MM.YYYY HH:mm:ss')}</Typography>
      <Typography>
        <strong>Статус: </strong>
        <span>{setup.word}</span>
      </Typography>
      <Progress mycolor={setup.color} variant="determinate" value={setup.percent} />
      { 
        setup.doubleWord != null
        ?
        <Typography>
          <strong>Статус: </strong>
          <span>{doubleWord}</span>
        </Typography>
        :
        null
      }
      {
        setup.doublePercent != null
        ?
        <Progress mycolor={setup.color} variant="determinate" value={setup.doublePercent} />
        :
        null
      }
      <Settings>
        <Tooltip title="Перенести текст">
          <SettingsBtn onClick={()=>{set_request(el.request),setValue(0)}} size="small">
            <ReplyAllIcon />
          </SettingsBtn>
        </Tooltip>
        <Tooltip onClick={()=>{killJob(el.job_id)}} title="Удалить запрос">
          <SettingsBtn size="small">
            <DeleteOutlineIcon />
          </SettingsBtn>
        </Tooltip>
      </Settings>
    </HistoryItemWrapper>
  )
}

export default HistoryItem