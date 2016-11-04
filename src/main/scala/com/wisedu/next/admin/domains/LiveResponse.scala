package com.wisedu.next.admin.domains

case class LiveCpdailyInfo(id:Long,visitor_id:String,username:String,message:String,avatar:String,
                          belongto:Long,parent:Long,brother:Long,mid:Long,dateline:Long,pushed:Int,checked:Int)

case class LiveCpdailyResp(data:Seq[LiveCpdailyInfo])

