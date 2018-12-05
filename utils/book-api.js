const URI = 'https://www.douban.com/v2/book/search'
const fetch = require('./fetch')

/**
 * 抓取豆瓣读书特定类型的API
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       Promise对象
 */
function fetchApi(type, params) {
  return fetch(URI, type, params)
}

/**
 * 根据tag分类获取书籍列表数据
 * @param  {String} tag   类型，例如：'文学'
 * @param  {Number} page   页码
 * @param  {Number} count  页条数
 * @param  {String} search 搜索关键词 省略
 * @return {Promise}       Promise对象
 */
function findByTag(tag, page=1, count=20) {
  const params = { tag: tag, start: (page - 1) * count, count: count}
  return fetchApi('', params)
    .then(res => res.data)
}

/**
 * 根据关键词获取特定书籍
 * @param  {String} tag   类型，省略
 * @param  {Number} page   页码
 * @param  {Number} count  页条数
 * @param  {String} search 搜索关键词
 * @return {Promise}       Promise对象
 */
function findOne(q, page = 1, count = 20) {
  const params = { q: q, start: (page - 1) * count, count: count }
  return fetchApi('', params)
    .then(res => res.data)
}