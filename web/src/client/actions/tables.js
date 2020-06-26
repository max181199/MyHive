const tablesChanged = (payload) => {
  return {
    type: 'TABLES_CHANGED',
    payload: payload
  };
};

export {
  tablesChanged
}
