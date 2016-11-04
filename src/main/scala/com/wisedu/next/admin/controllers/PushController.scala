package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.PushService

/**
 * PushController
 *
 * @author croyson
 */
class PushController extends Controller {

  @Inject var pushService: PushService = _

  // 推送添加
  post("/v2/push/add") { request: PushAddReq =>
    pushService.addPush(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(PushOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(PushOpResp("failed", ""))
    }
  }

  // 推送修改
  post("/v2/push/edit") { request: PushModifyReq =>
    pushService.modifyPush(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(PushOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(PushOpResp("failed", ""))
    }
  }
  // 推送删除
  post("/v2/push/delete") { request: PushReq =>
    pushService.delPush(request.pushId).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(PushOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(PushOpResp("failed", ""))
    }
  }



  // 推送
  post("/v2/push/execute") { request: PushReq =>
    pushService.push(request.pushId).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(PushOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(PushOpResp("failed", ""))
    }
  }



  //获取推送列表
  get("/v2/pushs") { request: PushsReq =>
    pushService.getPushs(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

  //获取一个推送
  get("/v2/push/:pushId") { request: PushReq =>
    pushService.getPush(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }
}
