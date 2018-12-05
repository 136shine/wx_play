const URI = 'https://douban.uieee.com/v2/movie'
const fetch = require('./fetch')

/**
 * 抓取豆瓣电影特定类型的API
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       Promise对象
 */
function fetchApi(type, params) {
  return fetch(URI, type, params)
}

/**
 * 获取列表类型的数据
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Number} page   页码
 * @param  {Number} count  页条数
 * @param  {String} search 搜索关键词
 * @return {Promise}       Promise对象
 */
function findByType(type, page = 1, count = 20, search = '') {
  const params = { start: (page - 1) * count, count: count, city: '北京' }
  return fetchApi(type, search ? Object.assign(params, { q: search }) : params)
    .then(res => res.data)
}

/**
 * 获取单条类型的数据
 * @param  {Number} id     电影ID
 * @return {Promise}       Promise对象
 */
function findOne(id) {
  return fetchApi('subject/' + id)
    .then(res => res.data)
}

// module.exports = { findByType, findOne }
// export { findByType, findOne}
module.exports = {
  findBytype: findByType,
  findOne: findOne
}