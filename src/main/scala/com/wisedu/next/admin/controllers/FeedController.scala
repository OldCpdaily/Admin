package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.FeedService

/**
 * FeedController
 *
 * @author croyson
 */
class FeedController extends Controller {

  @Inject var feedService: FeedService = _

  // 咨询添加
  post("/v2/feed/add") { request: FeedAddReq =>
    feedService.addFeed(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedOpResp("failed", ""))
    }
  }

  //咨询编辑
  post("/v2/feed/edit") { request: FeedModifyReq =>
    feedService.modifyFeed(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedOpResp("failed", ""))
    }
  }

  //获取一个咨询
  get("/v2/feed/:contentId") { request: FeedReq =>
    feedService.getFeed(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

  //获取咨询列表
  get("/v2/feed/contentList") { request: FeedsReq =>
    feedService.getFeeds(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }
  //删除咨询
  post("/v2/feed/delete") { request: FeedDeleteReq =>
    feedService.deleteFeeds(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedOpResp("failed", ""))
    }
  }

  //启用/停用咨询 请求启用：1 请求停用：2
  post("/v2/feed/turnOnOff") { request: FeedEnableReq =>
    feedService.changeFeedState(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedOpResp("failed", ""))
    }
  }

}
