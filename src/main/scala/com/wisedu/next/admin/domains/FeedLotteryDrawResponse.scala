package com.wisedu.next.admin.domains

//抽奖操作返回值
case class FeedLotteryDrawOpResp(status: String, errorMsg: String)

case class FeedLotteryDrawInfo(luckyDrawId: String,luckyDrawTitle: String,
                               description: String,luckyDrawUrl: String,
                               winUrl: String,contentId:String,endTime:String)

//获取一条抽奖信息
case class FeedLotteryDrawResp(status: String, errorMsg: String,datas:Option[FeedLotteryDrawInfo])

//获取抽奖列表
case class LuckyDrawItem(luckyDrawId:String,luckyDrawTitle:String,contentId:String,luckyDrawUrl:String,winUrl:String,cTime:String,endTime:String)
case class LuckyDrawList(pageNumber:Int,totalSize:Int,pageSize:Int,rows:Seq[LuckyDrawItem])
case class LuckyDrawData(luckyDrawList:LuckyDrawList)
case class LuckyDrawListResp(code: String,datas:LuckyDrawData)


