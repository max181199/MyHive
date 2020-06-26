import updateTables from './tables';

const reducer = (state, action) => {
  return {
    tables: updateTables(state, action)
  };
};

export default reducer;
