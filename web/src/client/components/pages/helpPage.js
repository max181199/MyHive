import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Header from '../header'
import HelpContentList from '../helpContentList'
import { Fade } from '@material-ui/core';
import { saveAs } from 'file-saver';

const Root = styled.div`
  width: 100%;
  height: 100vh;
`;

const Background = styled.div`
    top : 50px;
    height : calc(100% - 50px);
    width : 100%;
    display: flex;
    margin : 0;
    padding : 0;
    justify-content: space-evenly;
    align-items: center;
    background-color :  rgba(220, 220, 220, 0.4);
`

const Papper = styled.div`
    height : 98%;
    margin : 0px 10px;
    width : ${props=>props.op ? 'calc(75% - 30px)' : 'calc(100% - 30px)'};
    transition: width 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    background-color : white;
    box-shadow: -1px 0px 2px -1px rgba(0,0,0,0.3), 1px 0px 2px -1px rgba(0,0,0,0.3),
                0px 1px 2px -1px rgba(0,0,0,0.5),0px -1px 2px -1px rgba(0,0,0,0.1)
    ;
`

const Content = styled.div`
    height : 98%;
    width : 25%;
    min-width : 300px;
    margin-left : 10px;
    background-color : white;
    box-shadow: -1px 0px 2px -1px rgba(0,0,0,0.3), 1px 0px 2px -1px rgba(0,0,0,0.3),
                0px 1px 2px -1px rgba(0,0,0,0.5),0px -1px 2px -1px rgba(0,0,0,0.1)
    ;
`

const HelpPage = () => {

    const [ open , setOpen ] = useState(true)

    return(
        <Root>
            <Header page='helpPage' state={open} cb={setOpen}/>
            <Background>
                { open 
                  ?
                  <Content >
                    <HelpContentList close={setOpen} />
                  </Content>
                  : 
                  null
                }
                <Papper op={open}>
                    <button onClick={()=>{download()}} >DOWNLOAD</button>
                </Papper>
            </Background>
        </Root>
    )
}


export default HelpPage