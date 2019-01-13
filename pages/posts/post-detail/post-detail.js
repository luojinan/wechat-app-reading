// pages/posts/post-detail/post-detail.js
var postsData = require('../../../mock/posts-data.js')
var app = getApp()

Page({

  data: {
    isPlayingMusic:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id-1
    var postData = postsData.postList[postId]
    this.setData({postData:postData,currentPostId:postId})

    var postsCollected = wx.getStorageSync('posts_collected')
    /*
     *本地缓存-收藏状态（对象）
     *posts-collected={
     *  ID:'true'/'false'
     *}
    */
    // 当本地缓存存在的时候,获取当前id的收藏状态
    if (postsCollected[postId]){
      var postCollected = postsCollected[postId]  // 对象的key值获取
      this.setData({
        collected:postCollected
      })
    } else if (postsCollected) {
      postsCollected[postId] = false
      wx.setStorageSync('posts_collected', postsCollected)     
    }else{
      // 当不存在的时候，初始化这个本地缓存，让它存在
      var postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync('posts_collected', postsCollected)
    }

    // 获取全局变量播放状态
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId===postId){
      this.setData({isPlayingMusic:true})
    }

    // 获取音乐总控开关状态
    wx.onBackgroundAudioPlay(()=>{
      this.setData({isPlayingMusic:true})
      // 设置全局变量（播放状态、播放文章id）
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_currentMusicPostId = this.data.currentPostId
    })
    wx.onBackgroundAudioPause(()=>{
      this.setData({isPlayingMusic:false})
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentMusicPostId = null
    })

  },
  // 点击收藏按钮
  onCollectionTap(e){
    // 获取本地缓存的对象（因为要更新本地缓存，不仅仅需要当前收藏状态）
    var postsCollected = wx.getStorageSync('posts_collected')
    var postCollected = postsCollected[this.data.currentPostId]
    //点击置反
    postCollected = !postCollected
    postsCollected[this.data.currentPostId] = postCollected
    //更新数据，包括本地缓存
    // this.setData({collected:postCollected})
    // wx.setStorageSync('posts_collected', postsCollected)

    // this.showModal(postsCollected,postCollected)  //弹窗方法
    this.showToast(postsCollected,postCollected)
  },
  //收藏弹窗
  showModal(postsCollected,postCollected){
    var that = this
    wx.showModal({
      title: '收藏',
      content: postCollected?'收藏该文章？':'取消收藏该文章？',
      showCancel:'true',
      cancelText:'取消',
      cancelColor:'#333',
      confirmText:'确认',
      confirmColor:'#405f80',
      success(res){
        if(res.confirm){
          that.setData({ collected: postCollected })
          wx.setStorageSync('posts_collected', postsCollected)
        }
      }
    })
  },
  // 收藏弹窗
  showToast(postsCollected, postCollected){
    this.setData({ collected: postCollected })
    wx.setStorageSync('posts_collected', postsCollected)
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      icon: 'success'
    })
  },
  // 点击分享弹窗
  onShareTap(e){
    var itemList = ['分享给微信好友','分享到朋友圈','分享到QQ','分享到微博']
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success(res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '现在无法实现分享功能',
        })
      }
    })  
  },
  // 点击音乐按钮
  onMusicTap(e){
    if(this.data.isPlayingMusic){
      wx.pauseBackgroundAudio() //暂停播放
      this.setData({isPlayingMusic:false})
    }else{
      wx.playBackgroundAudio({
        dataUrl: this.data.postData.music.url,
        title: this.data.postData.music.title
      })
      this.setData({isPlayingMusic:true})
    }
  }
  
})