package com.wisedu.next.admin.domains

import com.twitter.finatra.request.RouteParam

case class LiveCpdailyReq(@RouteParam c:String="activity",@RouteParam a:String="ajaxGetComment",
                          @RouteParam id:Int = 9124,mid:Int = 0,@RouteParam dataId:Int = 1,
                          @RouteParam pageSize:Int=20,@RouteParam checked:Int=1)


