package com.wisedu.next.admin.domains

import com.twitter.finatra.request._


//新增校园媒体号
case class MediaAddReq(@FormParam campusMediaId: String,@FormParam campusMediaName: String, @FormParam sourceType: String, @FormParam source: String,
                       @FormParam organizationType: String, @FormParam description: String, @FormParam campusMediaLogo: String,
                       @FormParam backgroundImg: String, @FormParam collegeId: String,@FormParam sortNum: String,@FormParam isDisplay: String)

//修改校园媒体号
case class MediaModifyReq(@FormParam campusMediaId: String, @FormParam campusMediaName: String, @FormParam sourceType: String,
                          @FormParam source: String, @FormParam organizationType: String, @FormParam description: String,
                          @FormParam campusMediaLogo: String, @FormParam backgroundImg: String, @FormParam collegeId: String,@FormParam sortNum: String,
                          @FormParam isDisplay: String)

//获取一个校园号
case class MediaReq(@RouteParam campusMediaId: String)

//删除一个校园号
case class MediaDeleteReq(@RouteParam campusMediaId: String)

//验证标签编号
case class MediaValidIdReq(@RouteParam campusMediaId: String)


//获取校园号列表
case class MediasReq(@QueryParam organizationType:String, @QueryParam sourceType:String, @QueryParam campusMediaName: String, @QueryParam pageSize: Int = 10, @QueryParam pageNumber: Int = 1)

