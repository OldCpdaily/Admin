package com.wisedu.next.admin.domains

import com.twitter.finatra.request.{FormParam, RouteParam}


//系统码表类型添加
case class SysCodeAddReq(@FormParam value: String, @FormParam display: String,
                               @FormParam typeId: String,@FormParam sortNum: Int=0,
                         @FormParam description: String)

//系统码表类型修改
case class SysCodeModifyReq(@FormParam value: String,@FormParam display: String,
                               @FormParam typeId: String,@FormParam sortNum: Int=0,
                            @FormParam description: String)

//系统码表类型删除
case class SysCodeDeleteReq(@RouteParam value: String,@RouteParam typeId: String)

//校验一条系统码表编号唯一性
case class SysCodeValidReq(@RouteParam value: String,@RouteParam typeId: String)

//获取一条系统码表数据
case class SysCodeReq(@RouteParam value: String,@RouteParam typeId: String)

//获取某一类型下的所有数据
case class SysCodeByTypeReq(@RouteParam typeId: String)


//获取系统码表数据列表
case class SysCodesReq(@RouteParam typeId: Option[String],@RouteParam pageSize: Int = 10,@RouteParam pageNumber: Int = 1 )