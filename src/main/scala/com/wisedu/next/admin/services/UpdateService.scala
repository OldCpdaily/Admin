package com.wisedu.next.admin.services

import java.util.UUID
import javax.inject.{Inject, Singleton}

import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.models.{FeedUpdate, User}
import com.wisedu.next.services._

/**
 * Created by croyson on 2016/5/20
 */

@Singleton
class UpdateService {
  @Inject var updateBaseService: UpdateBaseService = _
  @Inject var userBaseService: UserBaseService = _
  @Inject var feedBaseService: FeedBaseService = _
  @Inject var collegeBaseService: CollegeBaseService = _


  def toGetUpdatesResp(update: FeedUpdate, user: User,depart:String, sub_update_num: Long): GetUpdatesResp = {
    if (update.isAnonymous == 1)
      GetUpdatesResp( "匿名用户", "/v2/statics/anonymousUser.jpg",
        user.collegeName,depart, "", update.likeNum, update.content,user.sex.toString, update.cTime,
        sub_update_num, update.imgUrls, update.isAnonymous)
    else
      GetUpdatesResp( user.alias, user.imgUrl,
        user.collegeName,depart, user.cla, update.likeNum, update.content, user.sex.toString, update.cTime,
        sub_update_num, update.imgUrls, update.isAnonymous)
  }


  def getUpdates(request: GetUpdatesRequest): Future[GetUpdatesResponse] = {
    val limits = request.limits
    val offset = request.offset
    val feed_id = request.feed_id
    updateBaseService.collUpdatesById(feed_id, "feedId", limits, offset).flatMap {
      updates => Future.collect(updates.map {
        update => {
          val userF = userBaseService.getUserById(update.userId).map(_.getOrElse(userBaseService.getDefaultUser()))
          val updateNumF = feedBaseService.getUpdateNumById(update.feedId).map(_.getOrElse(0L))
          for {
            user <- userF
            updateNum <- updateNumF
          } yield (update, user, updateNum)
        }.flatMap{
          case (update, user, updateNum) => collegeBaseService.getDepartById(user.depart).map{
            case Some(dep) =>(update, user,dep.departName, updateNum)
            case None => (update, user,"", updateNum)
          }
        }.map{
          case  (update, user,departName, updateNum)  => toGetUpdatesResp(update, user,departName, updateNum)
        }
      })
    }.map(item => GetUpdatesResponse(item))
  }


  def getById(request: GetFeedUpdateRequest): Future[FeedUpdateResp] = {
    updateBaseService.getById(UUID.fromString(request.updateId)).flatMap {
      case Some(update) => {
        val userF = userBaseService.getUserById(update.userId).map(_.getOrElse(userBaseService.getDefaultUser()))
        val updateNumF = feedBaseService.getUpdateNumById(update.feedId).map(_.getOrElse(0L))
        for {
          user <- userF
          updateNum <- updateNumF
        } yield (update, user, updateNum)
      }.flatMap{
        case (update, user, updateNum) => collegeBaseService.getDepartById(user.depart).map{
          case Some(dep) =>(update, user,dep.departName, updateNum)
          case None => (update, user,"", updateNum)
        }
      }.map{
        case  (update, user,departName, updateNum)  => toGetUpdatesResp(update, user,departName, updateNum)
      }.map {
        item => FeedUpdateResp("success", "", Some(item))
      }
      case None => Future(FeedUpdateResp("failed", "not exist!", None)) //不存在返回失败
    }
  }
}
