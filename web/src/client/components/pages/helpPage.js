import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Header from '../header'

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
    width : 73%;
    background-color : white;
    box-shadow: -1px 0px 2px -1px rgba(0,0,0,0.3), 1px 0px 2px -1px rgba(0,0,0,0.3),
                0px 1px 2px -1px rgba(0,0,0,0.5),0px -1px 2px -1px rgba(0,0,0,0.1)
    ;
`

const Content = styled.div`
    height : 98%;
    width : 25%;
    background-color : white;
    box-shadow: -1px 0px 2px -1px rgba(0,0,0,0.3), 1px 0px 2px -1px rgba(0,0,0,0.3),
                0px 1px 2px -1px rgba(0,0,0,0.5),0px -1px 2px -1px rgba(0,0,0,0.1)
    ;
`






const HelpPage = () => {
    return(
        <Root>
            <Header page='helpPage'/>
            <Background>
                <Content>
                    <p>Content</p>
                </Content>
                <Papper>
                    <p>Papper</p>
                </Papper>
            </Background>
        </Root>
    )
}

export default HelpPage