package com.wisedu.next.admin.services

import java.text.SimpleDateFormat
import java.util.UUID
import javax.inject.{Inject, Singleton}

import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.models.FeedLotteryDraw
import com.wisedu.next.services.{FeedBaseService, FeedLotteryDrawBaseService}
import org.joda.time.DateTime

/**
 * Created by croyson on 2016/5/20
 */

@Singleton
class FeedLotteryDrawService {
  @Inject var feedLotteryDrawBaseService: FeedLotteryDrawBaseService = _
  @Inject var feedBaseService: FeedBaseService = _

  //新增抽奖
  def addLotteryDraw(request: FeedLotteryDrawAddReq): Future[Boolean] = {
    try {
      val feedLotteryDraw = FeedLotteryDraw("", UUID.randomUUID().toString, request.luckyDrawTitle,
        request.description, request.luckyDrawUrl, request.winUrl, DateTime.now,
        new DateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(request.endTime)))
      feedLotteryDrawBaseService.insFeedLotteryDraw(feedLotteryDraw).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //修改抽奖
  def modifyLotteryDraw(request: FeedLotteryDrawModifyReq): Future[Boolean] = {
    try {
      val feedLotteryDraw = FeedLotteryDraw("", request.luckyDrawId, request.luckyDrawTitle,
        request.description, request.luckyDrawUrl, request.winUrl, DateTime.now,
        new DateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(request.endTime)))
      feedLotteryDrawBaseService.updFeedLotteryDraw(feedLotteryDraw).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //删除抽奖
  def deleteLotteryDraw(request: FeedLotteryDrawDeleteReq): Future[Boolean] = {
    try {
      Future.collect(
        request.luckyDrawId.split(",").map {
          item => feedLotteryDrawBaseService.delById(item)
        }).
        map {
          rst => true
        }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //获取一个抽奖
  def getLotteryDraw(request: FeedLotteryDrawReq): Future[FeedLotteryDrawResp] = {
    feedLotteryDrawBaseService.getById(request.luckyDrawId).map {
      case Some(draw) => FeedLotteryDrawResp("success", "", Some(FeedLotteryDrawInfo(draw.lotteryDrawId, draw.lotteryDrawTitle, draw.lotteryDrawDescr,
        draw.lotteryDrawUrl, draw.lotteryDrawRstUrl, draw.feedId, draw.finishTime.toString("yyyy-MM-dd HH:mm"))))
      case None => FeedLotteryDrawResp("failed", "not exist!", None) //不存在返回失败
    }
  }

  //获取抽奖列表数据
  def getLotteryDraws(request: FeedLotteryDrawsReq): Future[LuckyDrawListResp] = {
    feedLotteryDrawBaseService.collFeedLotteryDrawPageList(request.pageSize, (request.pageNumber - 1) * request.pageSize).map {
      drawPage => {
        LuckyDrawListResp("0", LuckyDrawData(LuckyDrawList(request.pageNumber, drawPage._2, request.pageSize, drawPage._1.map {
          draw => {
            LuckyDrawItem(draw.lotteryDrawId, draw.lotteryDrawTitle, draw.feedId, draw.lotteryDrawUrl, draw.lotteryDrawRstUrl, draw.cTime.toString("yyyy-MM-dd HH:mm"), draw.finishTime.toString("yyyy-MM-dd HH:mm"))
          }
        })))
      }
    }
  }

}
