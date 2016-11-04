package com.wisedu.next.admin.domains

//咨询操作返回值
case class FeedOpResp(status: String, errorMsg: String)

case class FeedInfo(contentId: String, title: String,
                    tags: String, showChannel: String,
                    sourceType: String, sourceAccount: String,
                    displayType: String, videoShareCode: String,
                    videoSourceUrl: String, broadcastState: String,
                    barrage: String, broadcastStartTime: String,
                    permissionsLimit: String, schoolLimit: String,
                    overView: String, contentType: String,
                    link: String, detailContent: String,
                    picture1: String, picture2: String,
                    picture3: String, commentLimit: String,
                    commentType: String, broadcastTime: String,
                    luckyDrawId: String, videoType: String,
                    groups: String, localLink: String,
                    sortNum: String, publishTime: String,
                    topicInviter: String,advImg: String,
                    listImgType: String,permitEmotions: String,
                    permitThumbsUp: String)

//获取一条虚拟组
case class FeedResp(status: String, errorMsg: String, datas: Option[FeedInfo])

//获取咨询列表
case class FeedItem(contentId: String, title: String, contentHtmlUrl: String, tags: String, sourceAccount: String, displayType: String,
                    readNum: Long, commentNum: Long, shareNum: Long, createTime: String, publishTime: String, state: String, contentType: String)

case class FeedList(pageNumber: Int, totalSize: Int, pageSize: Int, rows: Seq[FeedItem])

case class FeedData(contentList: FeedList)

case class FeedListResp(code: String, datas: FeedData)
