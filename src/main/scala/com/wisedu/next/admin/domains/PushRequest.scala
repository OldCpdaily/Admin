package com.wisedu.next.admin.domains

import com.twitter.finagle.http.Request
import com.twitter.finatra.request._

//推送添加
case class PushAddReq(@RequestInject request: Request,
                      @FormParam alterContent: String, @FormParam title: String,
                      @FormParam platform: String, @FormParam audienceType: String,
                      @FormParam tags: String, @FormParam alias: String,
                      @FormParam feedId: String, @FormParam subParam: String)

//推送添加
case class PushModifyReq(@FormParam pushId: String,
                      @FormParam alterContent: String, @FormParam title: String,
                      @FormParam platform: String, @FormParam audienceType: String,
                      @FormParam tags: String, @FormParam alias: String,
                      @FormParam feedId: String, @FormParam subParam: String)

//获取推送列表
case class PushsReq(@RouteParam pageSize: Int = 10, @RouteParam pageNumber: Int = 1, @RouteParam alterContent: String, @RouteParam status: String)


//获取一条推送记录
case class PushReq(@RouteParam pushId: String)