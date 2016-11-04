package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.{ExitLiveService, UpdateService}

/**
 * CollegeController
 *
 * @author croyson
 */
class UpdateController extends Controller {

  @Inject var updateService: UpdateService = _
  @Inject var exitLiveService: ExitLiveService = _
  //获取咨询评论
  get("/v2/feeds/:feed_id/updates") { request: GetUpdatesRequest =>
    updateService.getUpdates(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

  // 评论详情
  get("/v2/updates/:updateId") { request: GetFeedUpdateRequest =>
     updateService.getById(request).map {
       resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
      }
  }

  //直播评论
  get("/v2/updates/liveCpdaily") { request: LiveCpdailyReq =>
    exitLiveService.getLiveUpdates(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }
}
