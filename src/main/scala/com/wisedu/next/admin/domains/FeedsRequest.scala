package com.wisedu.next.admin.domains

import com.twitter.finatra.request.{FormParam, QueryParam, RouteParam}


//新增资讯格式
case class FeedAddReq(@FormParam title: String,
                      @FormParam tags: String, @FormParam showChannel: String, @FormParam sourceType: String,
                      @FormParam sourceAccount: String, @FormParam displayType: String, @FormParam videoShareCode: String,
                      @FormParam videoSourceUrl: String, @FormParam broadcastState: String, @FormParam barrage: String,
                      @FormParam broadcastStartTime: String,
                      @FormParam permissionsLimit: String, @FormParam schoolLimit: String,
                      @FormParam overView: String, @FormParam contentType: String, @FormParam link: String,
                      @FormParam detailContent: String, @FormParam picture1: String, @FormParam picture2: String,
                      @FormParam picture3: String, @FormParam commentLimit: String,
                      @FormParam commentType: String, @FormParam broadcastTime: String,
                      @FormParam luckyDrawId: String,@FormParam videoType: String,
                      @FormParam groups: String,@FormParam sortNum: String,@FormParam publishTime: String,
                      @FormParam topicInviter: String,@FormParam advImg: String,
                      @FormParam listImgType: String,@FormParam permitEmotions: String,
                      @FormParam permitThumbsUp: String)

//修改资讯格式
case class FeedModifyReq(@FormParam contentId: String, @FormParam title: String,
                         @FormParam tags: String, @FormParam showChannel: String, @FormParam sourceType: String,
                         @FormParam sourceAccount: String, @FormParam displayType: String, @FormParam videoShareCode: String,
                         @FormParam videoSourceUrl: String, @FormParam broadcastState: String, @FormParam barrage: String,
                         @FormParam broadcastStartTime: String, @FormParam permissionsLimit: String, @FormParam schoolLimit: String,
                         @FormParam overView: String, @FormParam contentType: String, @FormParam link: String,
                         @FormParam detailContent: String, @FormParam picture1: String, @FormParam picture2: String,
                         @FormParam picture3: String, @FormParam commentLimit: String, @FormParam commentType: String,
                         @FormParam broadcastTime: String,
                         @FormParam luckyDrawId: String,@FormParam videoType: String,
                         @FormParam groups: String,@FormParam sortNum: String,@FormParam localLink: String,@FormParam publishTime: String,
                         @FormParam topicInviter: String,@FormParam advImg: String,
                         @FormParam listImgType: String,@FormParam permitEmotions: String,
                         @FormParam permitThumbsUp: String)


//获取一个咨询
case class FeedReq(@RouteParam contentId: String)

//删除咨询  多个以,隔开
case class FeedDeleteReq(@RouteParam contentId: String)


//启用停用咨询  多个以,隔开
case class FeedEnableReq(@RouteParam contentId: String, @RouteParam requestState: String)


case class FeedsReq(@QueryParam title: Option[String], @QueryParam source: Option[String],
                    @QueryParam group: Option[String], @QueryParam displayType: Option[String],
                    @QueryParam tag: Option[String],
                    @QueryParam state: Option[String], @QueryParam `*order`: Option[String],
                    @QueryParam pageSize: Int = 10, @QueryParam pageNumber: Int = 1)




