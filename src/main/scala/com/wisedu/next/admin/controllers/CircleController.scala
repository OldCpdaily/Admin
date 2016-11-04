package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.CircleService

/**
 * CircleController
 *
 * @author croyson
 */
class CircleController extends Controller {

  @Inject var circleService: CircleService = _

  //圈子添加
  post("/v2/circle/add") { request: CircleAddReq =>
    circleService.addCircle(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(CircleOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(CircleOpResp("failed", ""))
    }
  }

  //圈子编辑
  post("/v2/circle/edit") { request: CircleModifyReq =>
    circleService.modifyCircle(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(CircleOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(CircleOpResp("failed", ""))
    }
  }

  //获取一个圈子
  get("/v2/circle/:circleId") { request: CircleReq =>
    circleService.getCircleById(request.circleId).map {
      circleResp => response.ok.header("Access-Control-Allow-Origin", "*").json(circleResp)
    }
  }

  //获取圈子列表
  get("/v2/circles") { request: CirclesReq =>
    circleService.getCircles(request).map {
      circleListResp => response.ok.header("Access-Control-Allow-Origin", "*").json(circleListResp)
    }
  }
  //删除圈子
  post("/v2/circle/delete") { request: CircleDeleteReq =>
    circleService.deleteCircles(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(CircleOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(CircleOpResp("failed", ""))
    }
  }

  //判断是否圈子编号是否合法
  post("/v2/circle/validCircleId"){ request: CircleValidIdReq =>
    circleService.validCircleId(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(CircleOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(CircleOpResp("failed", ""))
    }
  }

}
