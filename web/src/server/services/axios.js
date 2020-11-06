const { AxiosError } = require('./custom-errors');
const axios = require('axios');
const instance = axios.create({
  headers: {'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Mobile Safari/537.36'}
});

const axiosGet = async (res, url) => {
  try {
    url = url.replace(/.+?\//i,'http://dad-proxy.consultant.ru')
    const res = await instance.get(encodeURI(url));
    return await res.data;
  } catch (e) {
    res.status(500).send(`Axios error: ${e.message}`);
    throw new AxiosError({
      message: e.message,
      url: url
    });
  }
}

const _axiosGet = async (res, url) => {
  try {
    url = url.replace(/.+?\//i,'http://dad-proxy.consultant.ru')
    const res = await instance.get(encodeURI(url));
    return await res.data;
  } catch (e) {
    throw new AxiosError({
      message: e.message,
      url: url
    });
  }
}

const _axiosDelete = async (res, url) => {
  try {
    url = url.replace(/.+?\//i,'http://dad-proxy.consultant.ru')
    const res = await axios.delete(encodeURI(url));
    return await res.data;
  } catch (e) {
    throw new AxiosError({
      message: e.message,
      url: url
    });
  }
}


const axiosPut = async (url,body,conf) => {
    const res = await axios.put(encodeURI(url),body,conf);
    return await res.data;
}

const axiosPost = async (res, url , body) => {
  try{
    url = url.replace(/.+?\//i,'http://dad-proxy.consultant.ru')
    const res = await axios.post(encodeURI(url),body,{
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    return await res.data;
  } catch(e){
    res.status(500).send(`Axios error: ${e.message}`);
    throw new AxiosError({
      message: e.message,
      url: url
    });
  }
}

const _axiosPost = async (res, url , body) => {
  try{
    url = url.replace(/.+?\//i,'http://dad-proxy.consultant.ru')
    const res = await axios.post(
      encodeURI(url),body,
      {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
      );
    return await res.data;
  } catch(e){
    throw new AxiosError({
      message: e.message,
      url: url
    });
  }
}


module.exports = {
  instance,
  axiosGet,
  axiosPost,
  axiosPut,
  _axiosPost,
  _axiosGet,
  _axiosDelete,
};
