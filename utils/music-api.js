const detailUri = 'https://www.kugou.com'
const listUri = 'https://songsearch.kugou.com'
const fetch = require('./fetch')

/**
 * 抓取豆瓣电影特定类型的API
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       Promise对象
 */
// function fetchApi(params) {
//   return fetch(URI, params)
// }

/**
 * 获取列表类型的数据
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Number} page   页码
 * @param  {Number} count  页条数
 * @param  {String} search 搜索关键词
 * @return {Promise}       Promise对象
 */
function findByKeyword(url, page = 1, pagesize = 20, keyword = '') {
  const params = { 
    page, 
    pagesize, 
    platform: 'WebFilter'
  }
  return fetch(listUri, url, keyword ? Object.assign(params, { keyword }) : params)
    .then(res => res.data)
}

/**
 * 获取单条类型的数据
 * @param  {Number} id     电影ID
 * @return {Promise}       Promise对象
 */
function findOne(url, id) {
  const params = {
    r: 'play/getdata',
    hash: id
  }
  return fetch(detailUri, url, params)
    .then(res => res.data)
}

// module.exports = { findByType, findOne }
// export { findByType, findOne}
module.exports = {
  findByKeyword: findByKeyword,
  findOne: findOne
}