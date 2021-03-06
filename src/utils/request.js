import fetch from 'dva/fetch';
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

function checkStatus(response) {
  const { status } = response;
  let responseMessage = '';
  if (status >= 200 && status < 300) {
    switch (status) {
      case 201:
        responseMessage = '正常；紧接 POST 命令';
        console.warn(responseMessage);
        break;
      case 202:
        responseMessage = '处理尚未完成';
        console.warn(responseMessage);
        break;
      case 203:
        responseMessage = '返回的信息只是一部分';
        console.warn(responseMessage);
        break;
      case 204:
        responseMessage = '正常；已接收请求，但不存在要回送的信息';
        return {};
      default:
        return response.json(); 
    }
  } else if (status >= 300 && status < 400) {
    switch (status) {
      case 301:
        responseMessage = '请求数据已永久性转移';
        throw new Error(responseMessage);
      case 302:
        responseMessage = '请求的数据临时具有不同';
        throw new Error(responseMessage);
      case 303:
        responseMessage = '请参阅其它URI';
        throw new Error(responseMessage);
      case 304:
        responseMessage = '未修改 — 未按预期修改文档';
        throw new Error(responseMessage);
      case 305:
        responseMessage = '使用代理 — 必须通过位置字段中提供的代理来访问请求的资源';
        throw new Error(responseMessage);
      case 306:
        responseMessage = '不再使用；保留此代码以便将来使用';
        throw new Error(responseMessage);
      default:
        responseMessage = '重定向';
        throw new Error(responseMessage);
    }
  } else if (status >= 400 && status < 500) {
    switch (status) {
      case 400:
        return response.json()
        .then((JSON => {
          responseMessage = JSON.message || '客户机中出现的错误';
          throw new Error(responseMessage);
        }));
      case 401:
        responseMessage = '请先登入再尝试';
        throw new Error(responseMessage);
      case 402:
        responseMessage = '需要付款，计费系统已有效';
        throw new Error(responseMessage);
      case 403:
        responseMessage = '禁止访问';
        throw new Error(responseMessage);
      case 404:
        responseMessage = '找不到请求的数据';
        throw new Error(responseMessage);
      case 405:
        responseMessage = '资源被禁止';
        throw new Error(responseMessage);
      case 406:
        responseMessage = '请求无法接受';
        throw new Error(responseMessage);
      case 407:
        responseMessage = '要求代理身份验证';
        throw new Error(responseMessage);
      case 410:
        responseMessage = '永久性禁止';
        throw new Error(responseMessage);
      case 412:
        responseMessage = '先决条件失败';
        throw new Error(responseMessage);
      case 414:
        responseMessage = '请求URI太长';
        throw new Error(responseMessage);
      case 415:
        responseMessage = '介质类型不受支持';
        throw new Error(responseMessage);
      case 422:
        return response.json()
        .then((JSON => {
          responseMessage = JSON.message || '客户机中出现的错误';
          throw new Error(responseMessage);
        }));
      default:
        responseMessage = '客户机中出现的错误';
        throw new Error(responseMessage);
    }
  } else if (status >= 500) {
    switch (status) {
      case 500:
        responseMessage = '内部错误，服务器不能完成请求';
        throw new Error(responseMessage);
      case 501:
        responseMessage = '服务器不支持请求的工具';
        throw new Error(responseMessage);
      case 502:
        responseMessage = '错误网关';
        throw new Error(responseMessage);
      case 503:
        responseMessage = '服务器过载或维护';
        throw new Error(responseMessage);
      case 504:
        responseMessage = '服务器请求超时';
        throw new Error(responseMessage);
      default:
        responseMessage = '服务器中出现的错误';
        
      throw new Error(responseMessage);
    }
  }
}
