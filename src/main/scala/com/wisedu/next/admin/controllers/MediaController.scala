package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finagle.http.Request
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.MediaService

/**
 * MediaController
 *
 * @author croyson
 */
class MediaController extends Controller {

  @Inject var mediaService: MediaService = _

  // 校园号添加
  post("/v2/media/add") { request: MediaAddReq =>
    mediaService.addService(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(MediaOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(MediaOpResp("failed", ""))
    }
  }

  //校园号编辑
  post("/v2/media/edit") { request: MediaModifyReq =>
    mediaService.modifyService(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(MediaOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(MediaOpResp("failed", ""))
    }
  }

  //获取一个校园号
  get("/v2/media/:campusMediaId") { request: MediaReq =>
    mediaService.getService(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

  //获取校园号列表
  get("/v2/medias") { request: MediasReq =>
    mediaService.getServices(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }
  //删除校园号
  post("/v2/media/delete") { request: MediaDeleteReq =>
    mediaService.deleteServices(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(MediaOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(MediaOpResp("failed", ""))
    }
  }

  //验证校园号编号
  post("/v2/media/validId") { request: MediaValidIdReq =>
    mediaService.validMediaId(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(MediaOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(MediaOpResp("failed", ""))
    }
  }

  //获取所有
  get("/v2/media/getMedias") { request: Request =>
    mediaService.getMediaCodes.map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

}
