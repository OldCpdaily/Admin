package com.wisedu.next.admin.domains

import com.twitter.finatra.request.RouteParam

//获取标签列表
case class UsersReq(@RouteParam userName: Option[String],@RouteParam isAnonymousUser: Option[String],
                    @RouteParam userStatus: Option[String],@RouteParam userTag: Option[String],
                    @RouteParam pageSize: Int = 10, @RouteParam pageNumber: Int = 1)

