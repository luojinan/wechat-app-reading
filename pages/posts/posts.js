import postsData from '../../mock/posts-data.js'
Page({
  data: {
    swiperImgs:[
      "/images/wx.png", "/images/vr.png","/images/iqiyi.png"
    ],
    postList:[]
  },
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/posts/post-detail/post-detail?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postList: postsData.postList
    })
    console.log(this.data.postList) // 与vue不同，引用数据this.postList不行，要用this.data.xxx
  },

  
})