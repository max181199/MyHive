import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

const MiniHeader = styled.div`
    height : 40px;
    background-color : rgba(100,100,100,0.1);
    width : 100%;
    display : flex;
    align-items : center;
    justify-content: center;
    font-size : 20px;
    font-weight: 200;
    box-shadow: 0px 1px 2px -1px rgba(0,0,0,0.5),0px -1px 2px -1px rgba(0,0,0,0.1);
`

const HelpContentList = ({close}) => {
    return (
        <MiniHeader>
            Содержание
        </MiniHeader>
    )
}

export default HelpContentList;