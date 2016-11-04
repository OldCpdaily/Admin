package com.wisedu.next.admin.domains

import com.twitter.finatra.request.{FormParam, RouteParam}


//标签添加
case class TagAddReq(@FormParam tagId: String, @FormParam tagName: String,
                     @FormParam tagType: String, @FormParam tagLevel: String,
                     @FormParam enabled: String, @FormParam isShown: String,
                     @FormParam description: String, @FormParam extendInfo: String,
                     @RouteParam tagDomain: String,@RouteParam createUser: String)

//标签修改
case class TagModifyReq(@FormParam tagId: String, @FormParam tagName: String,
                        @FormParam tagType: String, @FormParam tagLevel: String,
                        @FormParam enabled: String, @FormParam isShown: String,
                        @FormParam description: String, @FormParam extendInfo: String,
                        @FormParam tagDomain: String)

//标签删除(多个用,隔开)
case class TagDeleteReq(@RouteParam tagId: String)

//获取一条标签
case class TagReq(@RouteParam tagId: String)

//验证标签编号
case class TagValidIdReq(@RouteParam tagId: String)

//获取标签列表
case class TagsReq(@RouteParam tagDomain: String,@RouteParam pageSize: Int = 10, @RouteParam pageNumber: Int = 1)

//获取所有的标签 (选择的时候用)
case class TagsGetReq(@RouteParam tagDomain: String)