package com.wisedu.next.admin.services

import java.text.SimpleDateFormat
import java.util.UUID
import javax.inject.{Inject, Singleton}

import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.models._
import com.wisedu.next.services._
import org.joda.time.DateTime

/**
 * Created by croyson on 2016/5/20
 */

@Singleton
class FeedService {
  @Inject var feedBaseService: FeedBaseService = _
  @Inject var tagBaseService: TagBaseService = _
  @Inject var sysCodeService: SysCodeService = _
  @Inject var staticBaseService: StaticBaseService = _
  @Inject var serviceBaseService: ServiceBaseService = _
  @Inject var feedLotteryDrawBaseService: FeedLotteryDrawBaseService = _
  @Inject var groupFeedsBaseService: GroupFeedsBaseService = _
  @Inject var userBaseService: UserBaseService = _
  @Inject var varnishService: VarnishService = _
  val defaultCollegeUuid = "6e52da24-b3be-46fe-af5c-bd24d42cb0aa"

  //新增
  def addFeed(request: FeedAddReq): Future[Boolean] = {
    try {
      val feedId = UUID.randomUUID()

      val groups = request.groups.split(",")
      var group1 = ""
      var group2 = ""
      var group3 = ""
      var group4 = ""
      var group5 = ""
      var group6 = ""
      if (groups.nonEmpty) group1 = groups(0)
      if (groups.size > 1) group2 = groups(1)
      if (groups.size > 2) group3 = groups(2)
      if (groups.size > 3) group4 = groups(3)
      if (groups.size > 4) group5 = groups(4)
      if (groups.size > 5) group6 = groups(5)

      val mTime = if (request.publishTime.isEmpty) DateTime.now else new DateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(request.publishTime))

      val broadcastStartTime = if (request.broadcastStartTime.isEmpty) {
        DateTime.now()
      } else {
        new DateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(request.broadcastStartTime))
      }
      val videoType = if (request.videoType.isEmpty) 0 else request.videoType.toInt
      val commentLimit = if (request.commentLimit.isEmpty) 0 else request.commentLimit.toInt
      val broadcastState = if (request.broadcastState.isEmpty) 0 else request.broadcastState.toInt
      val barrage = if (request.barrage.isEmpty) 0 else request.barrage.toInt
      val contentType = if (request.contentType.isEmpty) 0 else request.contentType.toInt
      val listImgType = if (request.listImgType.isEmpty) 0 else request.listImgType.toInt
      val sortNo = if (request.sortNum.isEmpty) 0 else request.sortNum.toInt
      val permitEmotions = if (request.permitEmotions.isEmpty) 1 else request.permitEmotions.toInt
      val permitThumbsUp = if (request.permitThumbsUp.isEmpty) 1 else request.permitThumbsUp.toInt
      val contUrlF = if (!"1".equals(request.contentType)) Future(request.link)
      else {
        serviceBaseService.getServiceById(request.sourceAccount).map {
          case Some(ser) => genContentHtml(request.displayType, request.title, feedId.toString,
            request.videoShareCode, request.videoSourceUrl, request.videoType,
            request.detailContent, request.broadcastState, request.luckyDrawId, ser.name, request.contentType, broadcastStartTime)
          case None => genContentHtml(request.displayType, request.title, feedId.toString,
            request.videoShareCode, request.videoSourceUrl, request.videoType,
            request.detailContent, request.broadcastState, request.luckyDrawId, "", request.contentType, broadcastStartTime)
        }

      }
      contUrlF.flatMap {
        contUrl => {
          val srcUrl = if (request.link.isEmpty) contUrl else request.link
          val feed = Feed(feedId, request.title, request.sourceAccount, request.sourceType.toInt,
            request.displayType, request.overView,
            request.detailContent.replaceAll("</?[^>]+>", ""), contUrl, request.detailContent, srcUrl, request.videoShareCode, request.videoSourceUrl,
            request.picture1 + "," + request.picture2 + "," + request.picture3, 0, DateTime.now(), mTime,
            DateTime.now, "", broadcastStartTime,
            broadcastState, commentLimit,
            barrage, request.commentType, request.showChannel, request.broadcastTime, request.luckyDrawId, videoType,
            group1, group2, group3, group4, group5, group6, contentType, sortNo, request.topicInviter, listImgType,
            request.advImg, permitEmotions, permitThumbsUp)
          feedBaseService.insFeed(feed).map {
            rst => {
              //保存内容标签
              request.tags.split(",").map {
                tag => feedBaseService.addFeedTag(FeedTag(feedId, tag, 0, 0))
              }
              //保存内容学校限制
              if ("1".equals(request.permissionsLimit)) {
                request.schoolLimit.split(",").map {
                  collegeId => feedBaseService.insFeedPermission(FeedPermission(feedId, collegeId, 1))
                }
              } else {
                //插入默认学校
                feedBaseService.insFeedPermission(FeedPermission(feedId, defaultCollegeUuid, 1))
              }
              //更新抽獎
              if (!request.luckyDrawId.isEmpty) {
                feedLotteryDrawBaseService.updFeedId(request.luckyDrawId, feedId.toString)
              }

              //保存组内容
              if (groups.nonEmpty) {
                groups.map {
                  group => groupFeedsBaseService.insGroupFeed(GroupFeed(group, feedId.toString, DateTime.now, "14116003", 1))
                }
              }
              true
            }
          }
        }
      }

    } catch {
      case _: Exception => Future(false)
    }
  }

  //修改内容
  def modifyFeed(request: FeedModifyReq): Future[Boolean] = {
    try {


      val feedId = UUID.fromString(request.contentId)
      val broadcastStartTime = if (request.broadcastStartTime.isEmpty) {
        DateTime.now()
      } else {
        new DateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(request.broadcastStartTime))
      }
      val mTime = if (request.publishTime.isEmpty) DateTime.now else new DateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(request.publishTime))
      val listImgType = if (request.listImgType.isEmpty) 0 else request.listImgType.toInt
      val videoType = if (request.videoType.isEmpty) 0 else request.videoType.toInt
      val commentLimit = if (request.commentLimit.isEmpty) 0 else request.commentLimit.toInt
      val broadcastState = if (request.broadcastState.isEmpty) 0 else request.broadcastState.toInt
      val barrage = if (request.barrage.isEmpty) 0 else request.barrage.toInt
      val contentType = if (request.contentType.isEmpty) 0 else request.contentType.toInt
      val sortNo = if (request.sortNum.isEmpty) 0 else request.sortNum.toInt
      val permitEmotions = if (request.permitEmotions.isEmpty) 1 else request.permitEmotions.toInt
      val permitThumbsUp = if (request.permitThumbsUp.isEmpty) 1 else request.permitThumbsUp.toInt
      //生成静态文件
      val contUrlF = if ("0".equals(request.contentType)) Future(request.link)
      else if ("1".equals(request.contentType)) {
        serviceBaseService.getServiceById(request.sourceAccount).map {
          case Some(ser) => genContentHtml(request.displayType, request.title, feedId.toString,
            request.videoShareCode, request.videoSourceUrl, request.videoType,
            request.detailContent, request.broadcastState, request.luckyDrawId, ser.name, request.contentType, broadcastStartTime)
          case None => genContentHtml(request.displayType, request.title, feedId.toString,
            request.videoShareCode, request.videoSourceUrl, request.videoType,
            request.detailContent, request.broadcastState, request.luckyDrawId, "", request.contentType, broadcastStartTime)
        }

      } else {
        Future(request.localLink)
      }
      contUrlF.flatMap {
        contUrl => {
          val srcUrl = if (request.link.isEmpty) contUrl else request.link
          val feed = Feed(feedId, request.title, request.sourceAccount, request.sourceType.toInt,
            request.displayType, request.overView,
            request.detailContent.replaceAll("</?[^>]+>", ""), contUrl, request.detailContent, srcUrl, request.videoShareCode, request.videoSourceUrl,
            request.picture1 + "," + request.picture2 + "," + request.picture3, 0, DateTime.now(), mTime,
            DateTime.now, "", broadcastStartTime,
            broadcastState, commentLimit,
            barrage, request.commentType, request.showChannel, request.broadcastTime, request.luckyDrawId, videoType,
            "", "", "", "", "", "", contentType, sortNo, request.topicInviter, listImgType, request.advImg,
            permitEmotions, permitThumbsUp)

          feedBaseService.updFeed(feed).map {
            rst => {
              //更新内容标签
              feedBaseService.delFeedTagsByFeedId(feedId)
              request.tags.split(",").map {
                tag => feedBaseService.addFeedTag(FeedTag(feedId, tag, 0, 0))
              }
              //保存内容学校限制
              feedBaseService.delFeedPermissionsByFeedId(feedId)
              if ("1".equals(request.permissionsLimit)) {
                request.schoolLimit.split(",").map {
                  collegeId => feedBaseService.insFeedPermission(FeedPermission(feedId, collegeId, 1))
                }
              } else {
                feedBaseService.insFeedPermission(FeedPermission(feedId, defaultCollegeUuid, 1))
              }

              //更新抽獎
              if (!request.luckyDrawId.isEmpty) {
                feedLotteryDrawBaseService.updFeedId(request.luckyDrawId, feedId.toString)
              } else {
                feedLotteryDrawBaseService.getByFeedId(feedId.toString).map {
                  case Some(draw) => feedLotteryDrawBaseService.updFeedId(draw.lotteryDrawId, "")
                  case None =>
                }
              }
              val groups = request.groups.split(",")
              var group1 = ""
              var group2 = ""
              var group3 = ""
              var group4 = ""
              var group5 = ""
              var group6 = ""
              if (groups.nonEmpty) group1 = groups(0)
              if (groups.size > 1) group2 = groups(1)
              if (groups.size > 2) group3 = groups(2)
              if (groups.size > 3) group4 = groups(3)
              if (groups.size > 4) group5 = groups(4)
              if (groups.size > 5) group6 = groups(5)

              feedBaseService.updGroups(feedId, group1, group2, group3, group4, group5, group6)
              groupFeedsBaseService.delGroupFeedByFeedId(feedId.toString)
              //保存组内容
              if (groups.nonEmpty) {
                groups.map {
                  group => groupFeedsBaseService.insGroupFeed(GroupFeed(group, feedId.toString, DateTime.now, "14116003", 1))
                }
              }

              true
            }
          }
        }
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //删除内容
  def deleteFeed(request: FeedDeleteReq): Future[Boolean] = {
    try {
      Future.collect(
        request.contentId.split(",").map {
          item => feedBaseService.delFeed(UUID.fromString(item))
        }).map {
        rst => true
      }

    } catch {
      case _: Exception => Future(false)
    }
  }

  //获取一个内容
  def getFeed(request: FeedReq): Future[FeedResp] = {


    //获取标签
    feedBaseService.getFeedById(UUID.fromString(request.contentId)).flatMap {
      case Some(feed) => {
        //获取标签
        val tagIdsF = feedBaseService.getFeedTagsByFeedId(feed.feedId).map {
          feedTags => feedTags.map {
            feedTag => feedTag.tagId
          }
        }
        val fpsF = feedBaseService.getFeedPermissionsByFeedId(feed.feedId).map {
          fps => fps.map {
            fp => fp.collegeId.toString.replace(defaultCollegeUuid.toString, "")
          }
        }

        val imgs = feed.sImgUrl.split(",")
        var img1 = ""
        var img2 = ""
        var img3 = ""
        if (imgs.nonEmpty) img1 = imgs(0)
        if (imgs.size > 1) img2 = imgs(1)
        if (imgs.size > 2) img3 = imgs(2)

        val groupsF = groupFeedsBaseService.getGroupFeedsByFeedId(feed.feedId.toString).map {
          groups => groups.map {
            group => group.groupId
          }
        }

        val source = if (feed.contentType == 1) feed.source else ""

        for {
          tagIds <- tagIdsF
          fps <- fpsF
          groups <- groupsF
        } yield FeedInfo(feed.feedId.toString, feed.title, tagIds.mkString(","), feed.displayChannel,
          feed.srcType.toString, feed.serId.toString, feed.viewStyle, feed.videoShareCode, feed.videoAddr, feed.liveStatus.toString,
          feed.screenPopUpStatus.toString, feed.liveStartTime.toString("yyyy-MM-dd HH:mm"), "0", fps.mkString(","), feed.summ, feed.contentType.toString, feed.srcUrl, source, img1, img2,
          img3, feed.permitUpdate.toString,
          feed.updateType.toString, feed.videoLength, feed.lotteryDrawId, feed.videoType.toString, groups.mkString(","),
          feed.contUrl, feed.sortNo.toString, feed.mTime.toString("yyyy-MM-dd HH:mm"), feed.topicInviter, feed.advImg,
          feed.listImgType.toString, feed.permitEmotions.toString, feed.permitThumbsUp.toString)
      }.map {
        item => FeedResp("success", "", Some(item))
      }
      case None => Future {
        FeedResp("failed", "not exist!", None)
      } //不存在返回失败
    }
  }

  //获取咨询列表数据
  def getFeeds(request: FeedsReq): Future[FeedListResp] = {


    val orderInfo = request.`*order` match {
      case Some("+readNum") => " readNum asc "
      case Some("-readNum") => " readNum desc "
      case Some("+commentNum") => " updateNum asc "
      case Some("-commentNum") => " updateNum desc "
      case Some("+shareNum") => " shareNum asc "
      case Some("-shareNum") => " shareNum desc "
      case Some("+createTime") => " cTime asc "
      case Some("-createTime") => " cTime desc "
      case Some("+publishTime") => " mTime asc "
      case Some("-publishTime") => " mTime desc "
      case _ => ""
    }

    feedBaseService.collFeedPageList(request.displayType.getOrElse(""), request.title.getOrElse(""), request.source.getOrElse(""),
      request.group.getOrElse(""), request.tag.getOrElse(""), request.state.getOrElse(""), orderInfo,
      request.pageSize, (request.pageNumber - 1) * request.pageSize).flatMap {
      FeedPage => {
        Future.collect(FeedPage._1.map {
          feed => {
            //标签
            val feedTagsF = feedBaseService.getFeedTagsByFeedId(feed.feedId).flatMap {
              tags => Future.collect(tags.map {
                feedTag => tagBaseService.getTagById(feedTag.tagId).map {
                  case Some(tag) => tag.tagName + "(" + tag.tagId + ")"
                  case None => ""
                }
              })
            }
            val feedStateF = feedBaseService.getFeedStatsById(feed.feedId).map {
              case Some(feedState) => feedState
              case None => FeedStat(feed.feedId, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            }

            val serNameF = if (feed.srcType == 0) {
              serviceBaseService.getServiceById(feed.serId).map {
                case Some(service) => service.name
                case None => ""
              }
            } else {
              userBaseService.getUserById(UUID.fromString(feed.serId)).map {
                case Some(user) => user.alias + "(" + user.userId + ")"
                case None => ""
              }
            }

            val viewStyleF = sysCodeService.getDisplay(feed.viewStyle.toString, "content_type")
            for {
              feedTags <- feedTagsF
              feedState <- feedStateF
              viewStyle <- viewStyleF
              serName <- serNameF
            } yield FeedItem(feed.feedId.toString, feed.title, feed.contUrl, feedTags.mkString(","), serName, viewStyle,
              feedState.readNum, feedState.updateNum, feedState.shareNum,
              feed.cTime.toString("yyyy-MM-dd HH:mm"), feed.mTime.toString("yyyy-MM-dd HH:mm"), feed.status.toString,
              feed.contentType.toString)
          }
        })
      }.map {
        item => FeedListResp("0", FeedData(FeedList(request.pageNumber, FeedPage._2, request.pageSize, item)))
      }
    }

  }

  //删除咨询
  def deleteFeeds(request: FeedDeleteReq): Future[Boolean] = {
    val contentId = request.contentId
    try {
      Future.collect(contentId.split(",").map {
        id => feedBaseService.delFeed(UUID.fromString(id))
      }).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //启用停用
  def changeFeedState(request: FeedEnableReq): Future[Boolean] = {
    val contentId = request.contentId
    val state = request.requestState
    try {
      Future.collect(contentId.split(",").map {
        id => feedBaseService.updStatus(UUID.fromString(id), state.toInt).flatMap {
          item => if ("1".equals(state)) {
            feedBaseService.getFeedById(UUID.fromString(id)).flatMap {
              case Some(feed) => if (feed.srcType == 0) {
                serviceBaseService.updServiceMTime(feed.serId, DateTime.now).map {
                  rst => true
                }
              } else {
                Future(true)
              }
              case None => Future(false)
            }
          } else {
            Future(true)
          }
        }
      }).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //生成模板
  def genContentHtml(viewStyle: String, title: String, feedId: String, videoShareCode: String, videoAddr: String, videoType: String,
                     content: String, liveState: String, prizeId: String, serName: String, contentType: String, liveStartTime: DateTime): String = {
    val model =
      """<!DOCTYPE html>
       <html lang="en">
       <head>
           <meta charset="UTF-8">
           <meta name="renderer" content="webkit">
           <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
           <title>%s</title>
           <link rel="icon" sizes="192x192" href="../templates/h5/img/icon.-180.png">
           <link rel="stylesheet" href="../templates/h5/model.css"/>
       </head>
       <body>
           <div class="container" id="container-next">
               <div class="container-box">
                   <!-- 资讯标题 -->
                   <div class="info-title">%s</div>
                   <!-- 小红包 -->
                   <div id="prize-topic"></div>
                   <!-- 作者 -->
                   <div id="info-author"></div>
                   <!-- 资讯内容 -->
                   <div class="info-content">
                     <div id="parameter" data-id="%s" data-type="%s" data-vediourl="%s" data-vedio="%s" data-vediotype="%s"  data-livestate="%s" data-livestarttime="%s" data-prizeid="%s" data-user="%s" style="display: none;"></div>
                        %s
                   </div>
               </div>
               <!-- 话题评论 -->
               <div id="topic-comment"></div>
               <!-- 普通资讯评论 -->
               <div id="info-comment"></div>
               <div id="bottom-download"></div>
           </div>
          <script type="text/javascript" src="../templates/h5/jquery-2.2.2.min.js"></script>
          <script type="text/javascript" src="../templates/h5/model.js"></script>
       </body>

       </html>
      """
    var rst = ""
    var liveStartTimeS = ""
    //需要改为获取码表?
    if (viewStyle.equals("3") && liveState.equals("2"))
      liveStartTimeS = liveStartTime.toString("yyyy-MM-dd HH:mm")
    rst = String.format(model, title, title, feedId, viewStyle, videoAddr, videoShareCode, videoType, liveState, liveStartTimeS, prizeId, serName, content)
    staticBaseService.putBucket(feedId.toString).map {
      item => staticBaseService.putObject(feedId.toString, "index.html", rst.getBytes)
    }
   val url =  staticBaseService.getObjectVUrl(feedId.toString, "index.html")
    varnishService.purgeVarnish(url)
    url
  }
}
