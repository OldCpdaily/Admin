package com.wisedu.next.admin.domains

//推送操作返回值
case class PushOpResp(status: String, errorMsg: String)

case class PushInfo(pushId: String, alterContent: String,
                    title: String, platform: String,
                    audienceType: String,tags: String,
                    alias: String, feedId: String,
                    subParam: String, cTime: String,
                    pushTime: String, status: String
                   )

//获取一条推送
case class PushResp(status: String, errorMsg: String,datas:Option[PushInfo])

//获取推送列表
case class PushItem(pushId: String, alterContent: String,
                    title: String, platform: String,
                    audienceType: String,tags: String,
                    alias: String, feedId: String,
                    subParam: String, cTime: String,
                    pushTime: String, status: String)
case class PushList(pageNumber:Int,totalSize:Int,pageSize:Int,rows:Seq[PushItem])
case class PushData(pushList:PushList)
case class PushListResp(code: String,datas:PushData)

