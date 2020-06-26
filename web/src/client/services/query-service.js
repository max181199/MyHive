const getQuery = async ({apiBase = `${window.location.protocol}//${window.location.host}/api`, url='', params = {}}) => {
  let paramsForQuery = '';

  for (let prop in params) {
    paramsForQuery += `${prop}=${params[prop]}&`
  }
  if (paramsForQuery.length > 0) {
    paramsForQuery = `?${paramsForQuery.slice(0, -1)}`;
  }

  try {
    const res = await fetch(`${apiBase}${url}${paramsForQuery}`);
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

const postQuery = async (url, body) => {
  const apiBase = `${window.location.protocol}//${window.location.host}/api`;

  try {
    const res = await fetch(`${apiBase}${url}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

export { getQuery, postQuery };
