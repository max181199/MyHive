const tablesChanged = (payload) => {
  return {
    type: 'TABLES_CHANGED',
    payload: payload
  };
};

const tablesUpdate = (payload) => {
  return {
    type: 'TABLES_UPDATE',
    payload: payload
  };
};

export {
  tablesChanged,
  tablesUpdate
}
