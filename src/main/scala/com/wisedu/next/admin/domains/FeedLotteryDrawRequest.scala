package com.wisedu.next.admin.domains

import com.twitter.finatra.request.{FormParam, RouteParam}


//抽奖添加
case class FeedLotteryDrawAddReq(@FormParam luckyDrawTitle: String,
                                 @FormParam description: String, @FormParam luckyDrawUrl: String,
                                 @FormParam winUrl: String,@FormParam endTime: String)

//抽奖修改
case class FeedLotteryDrawModifyReq(@FormParam luckyDrawId: String, @FormParam luckyDrawTitle: String,
                                    @FormParam description: String, @FormParam luckyDrawUrl: String,
                                    @FormParam winUrl: String,@FormParam endTime: String)

//抽奖删除
case class FeedLotteryDrawDeleteReq(@RouteParam luckyDrawId: String)

//获取一个抽奖
case class  FeedLotteryDrawReq(@RouteParam luckyDrawId: String)

//获取抽奖列表
case class FeedLotteryDrawsReq(@RouteParam pageSize: Int = 10, @RouteParam pageNumber: Int = 1)

