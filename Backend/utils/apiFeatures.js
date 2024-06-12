class ApiFeature {
  constructor(query, queryStr) {
    ;(this.query = query), (this.queryStr = queryStr)
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {}

    this.query = this.query.find({ ...keyword })
    return this
  }

  filter() {
    const queryCopy = { ...this.queryStr }
    const removeFields = ['keyword', 'page', 'limit']
    removeFields.forEach((key) => delete queryCopy[key])
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(lt|gt|lte|gte)\b/g, (key) => `$${key}`)
    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  pagination(resultPerPage) {
    const currPage = this.queryStr.page
    const skip = resultPerPage * (currPage - 1)
    this.query = this.query.limit(resultPerPage).skip(skip)
    return this
  }
}

module.exports = ApiFeature
