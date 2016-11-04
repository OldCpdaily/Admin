package com.wisedu.next.admin.domains

import com.twitter.finatra.request.{FormParam, RouteParam}

case class CircleLimit(schoolId:String,schoolName:String,isDefaultDisPlay:Int,isDefaultSave:Int)

//圈子添加
case class CircleAddReq(@FormParam circleId: String, @FormParam circleName: String,
                        @FormParam description: String, @FormParam circleType: String,
                        @FormParam strutsType: String, @FormParam sortNum: String,
                        @FormParam schoolLimit: String, @FormParam permissionsLimit: String,
                        @FormParam logo: String, @FormParam limits:String,
                        @FormParam backgroundImg: String, @FormParam sortStrategy: String,
                        @FormParam posterGroupId: String, @FormParam topMessages: String,
                        @FormParam isAnonymous: String, @FormParam isRealNamePost: String,
                        @FormParam isRealNameRespond: String,@FormParam notice: String,
                        @FormParam adminUser: String)

//圈子修改
case class CircleModifyReq(@FormParam circleId: String, @FormParam circleName: String,
                           @FormParam description: String, @FormParam circleType: String,
                           @FormParam strutsType: String, @FormParam sortNum: String,
                           @FormParam schoolLimit: String, @FormParam permissionsLimit: String,
                           @FormParam logo: String,@FormParam limits:String,
                           @FormParam backgroundImg: String, @FormParam sortStrategy: String,
                           @FormParam posterGroupId: String, @FormParam topMessages: String,
                           @FormParam isAnonymous: String, @FormParam isRealNamePost: String,
                           @FormParam isRealNameRespond: String,@FormParam notice: String,
                           @FormParam adminUser: String)

//圈子删除
case class CircleDeleteReq(@RouteParam circleId: String)

//获取一条圈子
case class CircleReq(@RouteParam circleId: String)

//验证组圈子编号
case class CircleValidIdReq(@RouteParam circleId: String)

//获取圈子
case class CircleCodesReq(@RouteParam typeId: Option[String])


case class CircleLiveReq(@RouteParam pageSize: Int = 10, @RouteParam pageNumber: Int = 1)

//获取系统码表数据列表
case class CirclesReq(@RouteParam circleName: Option[String],@RouteParam strutsType: Option[String], @RouteParam circleType: Option[String], @RouteParam pageSize: Int = 10, @RouteParam pageNumber: Int = 1)