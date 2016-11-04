package com.wisedu.next.admin.domains

import com.twitter.finatra.request.{FormParam, RouteParam}

//校园列表请求(选择)
case class CollegeNamesReq()

//学校添加
case class CollegeAddReq(@FormParam collegeId: String, @FormParam name: String,
                         @FormParam eName: String, @FormParam shortName: String,
                         @FormParam imgUrl: String, @FormParam lat: String,
                         @FormParam lng: String, @FormParam addr: String,
                         @RouteParam region: String)

//学校修改
case class CollegeModifyReq(@FormParam collegeId: String, @FormParam name: String,
                            @FormParam eName: String, @FormParam shortName: String,
                            @FormParam imgUrl: String, @FormParam lat: String,
                            @FormParam lng: String, @FormParam addr: String,
                            @FormParam region: String)

//学校组删除(多个用,隔开)
case class CollegeDeleteReq(@RouteParam collegeId: String)

//获取一条学校
case class CollegeReq(@RouteParam collegeId: String)


//获取学校列表
case class CollegesReq(@RouteParam region: String, @RouteParam pageSize: Int = 10, @RouteParam pageNumber: Int = 1)

//获取所有的学校 (选择的时候用)
case class CollegesGetReq(@RouteParam region: String)


//获取一条院系
case class DepartReq(@RouteParam departId: String)

//删除一个院系
case class DepartDeleteReq(@RouteParam departId: String)

//获取院系列表
case class DepartsReq(@RouteParam collegeId: String, @RouteParam pageSize: Int = 10, @RouteParam pageNumber: Int = 1)


//院系添加
case class DepartAddReq(@FormParam collegeId: String, @FormParam departName: String,
                        @FormParam descr: String, @FormParam sortNo: String = "0",
                        @FormParam departId: String,@FormParam departShortName: String)

//学校修改
case class DepartModifyReq(@FormParam collegeId: String, @FormParam departName: String,
                           @FormParam descr: String, @FormParam sortNo: String = "0",
                           @FormParam departId: String,@FormParam departShortName: String)