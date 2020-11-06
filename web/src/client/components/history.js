import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HistoryItem from './history_item'
import { getQuery, postQuery } from '../services/query-service'

const Root = styled.div`
  flex: 1;
`;


const History = ({ setValue,jobs, getJobs, set_request }) => {


  const [global, set_global] = useState([])

  useEffect(() => {
    let int = setInterval( async () => {
      let nd_update = []
      let un_update = jobs
        .reduce((y, x) => {
          let state = JSON.parse(x.state)
          if (state.state == 'SUCCEEDED' || state.state == 'FILED' || state.state == 'KILLED') {
            return ({ ...y, [x.job_id]: create_view(state) })
          } else {
            nd_update.push(getJobStatus(x.job_id))
            return y
          }
        }, {})
        nd_update = await Promise.all(nd_update)
        update_global({ ...un_update,...nd_update.reduce((y,x)=>{
          let state = x
          return ({ ...y, [state.job_id]: create_view(state) })
        },{})})
    }, 1000)

    if (jobs.length !== 0) {
      update_global(jobs.reduce((y, x) => {
        return ({ ...y, [x.job_id]: create_view(JSON.parse(x.state)) })
      }, {}))
    } else {clearInterval(int)}

    return (() => { clearInterval(int) })
  }, [jobs])

  const update_global = (obj) => {
    set_global({ ...global, ...obj })
  }

  const create_view = (status) => {
    if (status.state == 'KILLED') {
      return (
        {
          color: 'black',
          word: 'Отменено',
          percent: 100,
          doubleWord : null,
          doublePercent : null
        })
    } else if (status.state == 'creating') {
      return (
        {
          color: '#2196f3',
          word: 'Узнаем состояние отчета',
          percent: 100,
          doubleWord : null,
          doublePercent : null
        })
    } else if (status.state == 'SUCCEEDED') {
      return (
        {
          color: '#4caf50',
          word: 'Выполнено (100%)',
          percent: 100,
          doubleWord : null,
          doublePercent : null,
        })
    } else if (status.state == 'FAILED') {
      return (
        {

          color: '#ff5722',
          word: 'Ошибка',
          percent: 100,
          doubleWord : null,
          doublePercent : null,
        })
    } else if (status.state == 'ACCEPTED') {
      return (
        {
          color: '#4caf50',
          word: 'Запрос принят',
          percent: 0,
          doubleWord : null,
          doublePercent : null,
        })
    } else if (status.state === 'PREP') {
      return (
        {
          color: '#ffc107',
          word: 'Подготовка',
          percent: 100,
          doubleWord : null,
          doublePercent : null,
        })
    } else if (status.state === 'RUNNING') {
      if (status.setupProgress == 1) {
        return (
          {
            color: '#ffeb3b',
            word: 'Установка',
            percent: 100,
            doubleWord : null,
            doublePercent : null,
          })
      } else if (status.cleanupProgress == 1){
          return (
            {
              color: '#ffeb3b',
              word: 'Очистка',
              percent: 100,
              doubleWord : null,
              doublePercent : null,
            }
          )
      } else {
        const parseData = status.percentComplete == null ? null : status.percentComplete.split(' ')
        if (parseData == null){
          return(
            {
              color: '#2196f3',
              word: 'Map(??%)',
              percent: 0,
              doubleWord : 'Reduce(??%)',
              doublePercent : 0,
            }
          )
        } else {
          return (
            {
              color: '#2196f3',
              word: `Map(${parseData[1]}%)`,
              percent: parseData[1],
              doubleWord : `Reduce(${parseData[3]}%)`,
              doublePercent : parseData[3],
            }
          )
        }
      }
    }
  }

  const getJobStatus = async (job_id) => {
    let tmp = await getQuery('/get_job_status', { job_id })
      .then((data) => {
        if (data.state == 'ok') {
          return (data.status)
        } else {
          return ('*ERROR*')
        }
      })
    return (tmp)
  }



  return (
    <Root>
      <>
        {jobs.map((el) => {
          return (HistoryItem(el, global[el.job_id], getJobs, set_request,setValue))
        })}
      </>
    </Root>
  )
}

export default History;
