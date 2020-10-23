const getHeader = (path) => {
  return (
    new Promise(function (resolve, reject) {
      const fs = require('fs');
      try {
        let stream = fs.createReadStream(path, { encoding: 'utf8' })
        let header_tmp = ''
        let header = {}
        stream
          .on('open', () => { })
          .on('readable', function () {
            let char = stream.read(1)
            while (char !== '\n') {
              header_tmp += char;
              char = stream.read(1)
            }
            stream.close()
          })
          .on('close', () => {
            header['offset'] = header_tmp.length;
            header_tmp.split(',').forEach((el) => {
              let el_tmp = el.replace(/ /g, '')
              if (/\:/g.test(el_tmp)) {
                let ar = el_tmp.split(':')
                header[ar[0]] = ar[1]
              } else {
                header[el_tmp] = 'TEXT'
              }
            })
            resolve(header);
          })
          .on('error', (err) => {
            console.log('GET_HEADER_STREAM_ERROR', err)
            reject({
              'place': 'GET_HEADER_STREAM',
              'error': err
            })
          })
      } catch (err) {
        console.log('GET_HEADER_ERROR::: ', err)
        reject({
          'place' : 'GET_HEADER',
          'error' : err
        })
      }
    }))
}

module.exports = { getHeader };