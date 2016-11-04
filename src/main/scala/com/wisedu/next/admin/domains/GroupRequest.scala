package com.wisedu.next.admin.domains

import com.twitter.finatra.request.{FormParam, RouteParam}


//虚拟组添加
case class GroupAddReq(@FormParam groupId: String, @FormParam groupName: String, @FormParam groupType: String,
                       @FormParam contentTypeLimit: String, @FormParam tagLimit: String, @FormParam aggregationGroup: String,
                       @FormParam schoolLimit: String, @FormParam description: String, @FormParam permissionsLimit: String,
                       @FormParam sortNum: String, @FormParam groupParam: String,
                       @FormParam logo: String, @FormParam backgroundImg: String,
                       @FormParam startTime: String, @FormParam endTime: String,
                       @FormParam strutsType: String,@FormParam posterGroupId: String,
                       @FormParam isAnonymous: String)

//虚拟组修改
case class GroupModifyReq(@FormParam groupId: String, @FormParam groupName: String, @FormParam groupType: String,
                          @FormParam contentTypeLimit: String, @FormParam tagLimit: String, @FormParam aggregationGroup: String,
                          @FormParam schoolLimit: String, @FormParam description: String, @FormParam permissionsLimit: String,
                          @FormParam sortNum: String, @FormParam groupParam: String,
                          @FormParam logo: String, @FormParam backgroundImg: String,
                          @FormParam startTime: String, @FormParam endTime: String,
                          @FormParam strutsType: String,@FormParam posterGroupId: String,
                          @FormParam isAnonymous: String)

//虚拟组删除
case class GroupDeleteReq(@RouteParam groupId: String)

//获取一条虚拟组
case class GroupReq(@RouteParam groupId: String)

//验证组编号
case class GroupValidIdReq(@RouteParam groupId: String)

//获取虚拟组
case class GroupCodesReq(@RouteParam typeId: Option[String])


case class GroupLiveReq(@RouteParam pageSize: Int = 10,  @RouteParam pageNumber: Int = 1)

//获取系统码表数据列表
case class GroupsReq(@RouteParam groupName: Option[String], @RouteParam groupType: Option[String], @RouteParam pageSize: Int = 10, @RouteParam pageNumber: Int = 1)