// pages/movies/movies.js
var app = getApp()
Page({
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{}
  },

  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters'+'?start=0&count=3'
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3'
    var top50Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3'

    this.getMovieListData(inTheatersUrl,'inTheaters')
    this.getMovieListData(comingSoonUrl,'comingSoon')
    this.getMovieListData(top50Url,'top250')
  },
  getMovieListData(url,settedKey){
    var that = this
    wx.request({
      url: url,
      method: 'GET',
      success(res) {
        that.processDoubanData(res.data, settedKey)
      }
    })
  },
  // 处理数据
  processDoubanData(moviesDouban, settedKey){
    var movies = []
    for (var item of moviesDouban.subjects){
      var title = item.title
      if (item.title.length >=6){
        title = title.substring(0,6)+'...'
      }
      var temp = {
        title:title,
        average:item.rating.average,
        coverageUrl:item.images.large,
        movieId:item.id
      }
      movies.push(temp)
    }
    // 把数组以对象形式存入data
    var obj = {}
    obj[settedKey]={movies}
    this.setData(obj)
  }
 
})