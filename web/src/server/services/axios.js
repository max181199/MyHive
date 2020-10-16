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

const axiosPost = async (res, url , body) => {
  try{
    url = url.replace(/.+?\//i,'http://dad-proxy.consultant.ru')
    console.log('BEFORE::',encodeURI(url),body)
    const res = await axios.post(encodeURI(url),body);
    console.log('AFTER::',url,body)
    return await res.data;
  } catch(e){
    res.status(500).send(`Axios error: ${e.message}`);
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
};
