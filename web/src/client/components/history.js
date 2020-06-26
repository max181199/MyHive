import React, {useState, useEffect} from 'react';
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

const History = () => {
	return (
    <Root>
      <HistoryItem />
    </Root>
  )
}

const HistoryItem = () => {
  const [progress, setProgress] = React.useState(65);

	return (
    <HistoryItemWrapper>
      <Typography><strong>Дата:</strong> 15.06.2020 17:20</Typography>
      <Typography>
        <strong>Статус: </strong>
        <span>{`Выполнение (${progress}%)`}</span>
      </Typography>
      <Progress variant="determinate" value={progress} />
      <Settings>
        <Tooltip title="Текст запроса">
          <SettingsBtn size="small">
            <CodeIcon />
          </SettingsBtn>
        </Tooltip>
        <Tooltip title="Перенести текст">
          <SettingsBtn size="small">
            <ReplyAllIcon />
          </SettingsBtn>
        </Tooltip>
        <Tooltip title="Сохранить результат">
          <SettingsBtn size="small">
            <SaveIcon />
          </SettingsBtn>
        </Tooltip>
        <Tooltip title="Удалить запрос">
          <SettingsBtn size="small">
            <DeleteOutlineIcon />
          </SettingsBtn>
        </Tooltip>
      </Settings>
    </HistoryItemWrapper>
  )
}



export default History;
