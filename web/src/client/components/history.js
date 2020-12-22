import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HistoryItem from './history_item'
import { getQuery, postQuery } from '../services/query-service'

const Root = styled.div`
  flex: 1;
  overflow-y : auto;
`;


const History = ({ setValue,jobs, getJobs, set_request }) => {

  //console.log(global);
  const [global, set_global] = useState({})

  useEffect(()=>{

    jobs.forEach(job =>{
      let state = JSON.parse(job.state);
      if ( state.state == 'SUCCEEDED' || state.state == 'FILED' || state.state == 'KILLED' || state.state == 'cancel' ){
        update_global({[job.job_id] : create_view(state)})
      }
    })

    let int_id = setInterval(async () => {
      //console.log('Tic-tak')
      // Знаем все текущие работы
      let local_job = (await getQuery('/get_jobs')).rows
      //console.log("LOCALE_JOB",local_job);
      local_job.forEach(job => {
        let state = JSON.parse(job.state);
        if ( state.state == 'SUCCEEDED' || state.state == 'FILED' || state.state == 'KILLED' || state.state == 'cancel'){
          //update_global({[job.job_id] : create_view(state)})
        } else {
          getJobStatus(job.job_id).then ( data=>{
            update_global({[job.job_id] : create_view(data)})
          })
        }
      });
    }, 5000);
    return( ()=>{clearInterval(int_id)})
  },[])

  // useEffect( async () => {
    
  //   if (jobs.length !== 0) {
  //     update_global(jobs.reduce((y, x) => {
  //       return ({ ...y, [x.job_id]: create_view(JSON.parse(x.state)) })
  //     }, {}))
  //   }

  //   console.log("jobs",jobs)
  //   let int = setInterval( async () => {
  //     console.log('INT')
  //     let nd_update = []
  //     let un_update = jobs
  //       .reduce((y, x) => {
  //         let state = JSON.parse(x.state)
  //         if (state.state == 'SUCCEEDED' || state.state == 'FILED' || state.state == 'KILLED') {
  //           return ({ ...y, [x.job_id]: create_view(state) })
  //         } else {
  //           //console.log('STATE:',state.state)
  //           nd_update.push(getJobStatus(x.job_id))
  //           return y
  //         }
  //       }, {})
  //       console.log('TIME-1');
  //       nd_update = await Promise.all(nd_update)
  //       console.log('TIME-2');
  //       update_global({ ...un_update,...nd_update.reduce((y,x)=>{
  //         let state = x
  //         return ({ ...y, [state.job_id]: create_view(state) })
  //       },{})})
  //   },5000)

  // }, [jobs.length])

  const update_global = (obj) => {
    set_global(global => ({ ...global, ...obj }))
    // set_global({ ...global, ...obj })
  }

  //console.log(global);

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
    } else if (status.state == 'cancel') {
      return (
        {
          color: 'black',
          word: 'Ошибка',
          percent: 100,
          doubleWord : null,
          doublePercent : null
        })
    }else if (status.state == 'creating') {
      return (
        {
          color: '#2196f3',
          word: 'Начинаем создание отчета',
          percent: 100,
          doubleWord : null,
          doublePercent : null
        })
    } else if (status.state == 'loading') {
      return (
        {
          color: '#2196f3',
          word: 'Отправляем запрос на создание',
          percent: 100,
          doubleWord : null,
          doublePercent : null
        })
    } else if (status.state == 'cancel') {
      return (
        {
          color: 'darggrey',
          word: 'Отчет не может быть создан',
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
      if (status.mapProgress == 1 && status.reduceProgress == 1) {
        return (
          {
            color: '#ffeb3b',
            word: 'Удаляем временные данные',
            percent: 100,
            doubleWord : null,
            doublePercent : null,
          })
      } else {
        return(
          {
            color: '#2196f3',
            word: `Map(${ Math.trunc(status.mapProgress * 100) }%)`,
            percent: Math.trunc(status.mapProgress * 100),
            doubleWord : `Reduce(${ Math.trunc(status.reduceProgress * 100)}%)`,
            doublePercent : Math.trunc(status.reduceProgress * 100),
          }
        )
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
