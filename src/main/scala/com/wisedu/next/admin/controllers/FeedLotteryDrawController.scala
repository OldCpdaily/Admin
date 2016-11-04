package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.FeedLotteryDrawService

/**
 * FeedLotteryDrawController
 *
 * @author croyson
 */
class FeedLotteryDrawController extends Controller {

  @Inject var feedLotteryDrawService: FeedLotteryDrawService = _

  // 抽獎添加
  post("/v2/lotteryDraw/add") { request: FeedLotteryDrawAddReq =>
    feedLotteryDrawService.addLotteryDraw(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedLotteryDrawOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedLotteryDrawOpResp("failed", ""))
    }
  }

  //抽奖编辑
  post("/v2/lotteryDraw/edit") { request: FeedLotteryDrawModifyReq =>
    feedLotteryDrawService.modifyLotteryDraw(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedLotteryDrawOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedLotteryDrawOpResp("failed", ""))
    }
  }

  //获取一个抽奖
  get("/v2/lotteryDraw/:luckyDrawId") { request: FeedLotteryDrawReq =>
    feedLotteryDrawService.getLotteryDraw(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

  //获取抽奖列表
  get("/v2/lotteryDraws") { request: FeedLotteryDrawsReq =>
    feedLotteryDrawService.getLotteryDraws(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }
  //删除
  post("/v2/lotteryDraws/delete") { request: FeedLotteryDrawDeleteReq =>
    feedLotteryDrawService.deleteLotteryDraw(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedLotteryDrawOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(FeedLotteryDrawOpResp("failed", ""))
    }
  }
}
