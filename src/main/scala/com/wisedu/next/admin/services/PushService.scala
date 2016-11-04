package com.wisedu.next.admin.services

import java.util.UUID
import javax.inject.{Inject, Singleton}

import com.twitter.finatra.httpclient.{HttpClient, RequestBuilder}
import com.twitter.finatra.json.FinatraObjectMapper
import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.annotations.JPushHttpClient
import com.wisedu.next.models.Push
import com.wisedu.next.services.{ExClient, FeedBaseService, PushBaseService, TagBaseService}
import org.joda.time.DateTime

import scala.collection.mutable.{Map => MutMap}

/**
 * Created by croyson on 2016/5/20
 */

case class Extras(push_id: String, feed_id: UUID, view_type: String, sub_param: Option[String])

case class AndroidNotification(alert: String, title: String, extras: Extras)

case class IosNotification(alert: String, extras: Extras,sound:String,badge:Int)

case class PushOptions(time_to_live: Int, apns_production: Boolean)

case class Notification(android: Option[AndroidNotification], ios: Option[IosNotification])

case class Audience(tag: Option[Seq[String]], tag_and: Option[Seq[String]], alias: Option[Seq[String]])

case class PushResponse(sendno: String, msg_id: String)

@Singleton
class PushService {
  @Inject var pushBaseService: PushBaseService = _
  @Inject var sysCodeService: SysCodeService = _
  @Inject var tagBaseService: TagBaseService = _
  @Inject var exClient: ExClient = _
  @Inject var objectMapper: FinatraObjectMapper = _
  @Inject var feedBaseService: FeedBaseService = _
  @Inject
  @JPushHttpClient var jPushHttpClient: HttpClient = _

  //推送
  def push(pushId: String): Future[Boolean] = {
    try {
      pushBaseService.getPushById(pushId).flatMap {
        case Some(push) =>
          val headers = Map("Authorization" -> "Basic Y2FiN2IzYmNjZjM5NGYzODU2OGU2Yzc1OjIxNTIwOGQyYzBlYzc4MmUwOTgyZGM4Mw==")
          val audienceSeq = Seq("tag", "tag_and", "alias", "all")
          if (audienceSeq.contains(push.audienceType)) {
            feedBaseService.getFeedById(UUID.fromString(push.feedId)).flatMap {
              case Some(feed) =>
                val extras = Extras(pushId, UUID.fromString(push.feedId), feed.viewStyle, Some(push.feedSubParam))
                val iosNotification = IosNotification(push.alterContent, extras,"sound.caf",1)
                val androidNotification = AndroidNotification(push.alterContent, push.title, extras)
                val notification =
                  if ("android".equals(push.platform)) Notification(Some(androidNotification), Some(iosNotification))
                  else if ("ios".equals(push.platform)) Notification(None, Some(iosNotification))
                  else Notification(Some(androidNotification), Some(iosNotification))
                //val notification = Notification(Some(androidNotification), Some(iosNotification))
                val platform = if("all".equals(push.platform))  push.platform else Seq(push.platform)
                val options = PushOptions(60,true)
                val msg = MutMap("platform" -> platform, "notification" -> notification, "options" -> options)
                if (push.audienceType.equals("all")) {
                  msg("audience") = "all"
                } else {
                  val tag = push.audienceType match {
                    case "tag" => Some(push.tags.split(",").toSeq)
                    case _ => None
                  }
                  val tag_and = push.audienceType match {
                    case "tag_and" => Some(push.tags.split(",").toSeq)
                    case _ => None
                  }
                  val alias = push.audienceType match {
                    case "alias" => Some(push.alias.replaceAll("-", "_").split(",").toSeq)
                    case _ => None
                  }
                  msg("audience") = Audience(tag, tag_and, alias)
                }
                val body = objectMapper.writePrettyString(msg)
                jPushHttpClient.execute(RequestBuilder.post("/v3/push").headers(headers).body(body)).flatMap {
                  ret => if (ret.status.code == 200) {
                    pushBaseService.upStatus(push.pushId, 1).map {
                      rst => true
                    }
                  } else {
                    Future(false)
                  }
                }
              case None => Future(false)
            }
          } else {
            Future(false)
          }

        case None => Future(false)
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  def getPush(request: PushReq): Future[PushResp] = {
    pushBaseService.getPushById(request.pushId).flatMap {
      case Some(push) => {
        val statusF = sysCodeService.getDisplay(push.status.toString, "push_status")
        /*val audienceTypeF = sysCodeService.getDisplay(push.audienceType, "audience_type")
        val platformF = sysCodeService.getDisplay(push.platform, "platform_type")
        val tagsF = Future.collect(push.tags.split(",").map {
          tagId => tagBaseService.getTagById(tagId).map {
            case Some(tag) => tag.tagName
            case None => ""
          }
        })*/
        for {
          status <- statusF
         /* audienceType <- audienceTypeF
          platform <- platformF
          tags <- tagsF*/
        } yield PushInfo(push.pushId, push.alterContent, push.title,push. platform, push.audienceType, push.tags, push.alias, push.feedId, push.feedSubParam, push.cTime.toString("yyyy-MM-dd HH:mm"), push.pushTime.toString("yyyy-MM-dd HH:mm"), status)
      }.map {
        item => PushResp("success", "", Some(item))
      }
      case None => Future(PushResp("failed", "not exist!", None))
    }
  }


  //新增标签
  def addPush(request: PushAddReq): Future[Boolean] = {
    try {
      val pushId = UUID.randomUUID().toString
      val push = Push(pushId, request.platform, request.audienceType, request.tags, request.alias, request.alterContent,
        request.title, request.feedId, request.subParam, "admin", DateTime.now, DateTime.now, 0)
      pushBaseService.insPush(push).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //修改标签
  def modifyPush(request: PushModifyReq): Future[Boolean] = {
    try {
      val push = Push(request.pushId, request.platform, request.audienceType, request.tags, request.alias, request.alterContent,
        request.title, request.feedId, request.subParam, "admin", DateTime.now, DateTime.now, 0)
      pushBaseService.updPush(push).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //删除标签
  def delPush(pushId:String): Future[Boolean] = {
    try {
      pushBaseService.delPush(pushId).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }


  //获取标签列表数据
  def getPushs(request: PushsReq): Future[PushListResp] = {
    pushBaseService.collPushsPageList(request.status, request.alterContent, request.pageSize, (request.pageNumber - 1) * request.pageSize).flatMap {
      pushPage => {
        Future.collect(pushPage._1.map {
          push => {
            val statusF = sysCodeService.getDisplay(push.status.toString, "push_status")
            val audienceTypeF = sysCodeService.getDisplay(push.audienceType, "audience_type")
            val platformF = sysCodeService.getDisplay(push.platform, "platform_type")
            val tagsF = Future.collect(push.tags.split(",").map {
              tagId => tagBaseService.getTagById(tagId).map {
                case Some(tag) => tag.tagName
                case None => ""
              }
            })
            for {
              status <- statusF
              audienceType <- audienceTypeF
              platform <- platformF
              tags <- tagsF
            } yield PushItem(push.pushId, push.alterContent, push.title, platform, audienceType, tags.mkString(","), push.alias, push.feedId, push.feedSubParam, push.cTime.toString("yyyy-MM-dd HH:mm"), push.pushTime.toString("yyyy-MM-dd HH:mm"), status)
          }
        })
      }.map {
        item => PushListResp("0", PushData(PushList(request.pageNumber, pushPage._2, request.pageSize, item)))
      }
    }

  }


}
