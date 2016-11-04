package com.wisedu.next.admin.controllers

import javax.inject.Inject

import com.twitter.finagle.http.Request
import com.twitter.finatra.http.Controller
import com.twitter.finatra.http.request.RequestUtils
import com.twitter.finatra.utils.FuturePools
import com.wisedu.next.admin.domains.{ImageUpdateRequest, ImgUpdateResp}
import com.wisedu.next.services.{BaseFunctions, StaticBaseService}
import org.joda.time.DateTime

class StaticsController extends Controller {

  private val futurePool = FuturePools.unboundedPool("CallbackConverter")
  @Inject var staticBaseService: StaticBaseService = _
  get("/v2/statics/:*") { request: Request =>
    futurePool {
      if (request.params("*").contains("../"))
        response.forbidden
      else
      if (request.params("*").contains(".html")) {
        response.ok.file(request.params("*"))
      } else {
        response.ok.header("Cache-Control", "max-age=259200").file(request.params("*"))
      }

    }

  }
  post("/v2/img/upload") { request: ImageUpdateRequest =>
    val file = RequestUtils.multiParams(request.request).values.head
    val path = DateTime.now().toString("yyyyMMdd")
    staticBaseService.putBucket(path).flatMap {
      rst => if (rst) {
        staticBaseService.putObject(path, BaseFunctions.getIdFromName(file.filename.getOrElse("wuming")), file.data).map {
          filePath => response.ok.header("Access-Control-Allow-Origin", "*").json(ImgUpdateResp("", "success", filePath))
        }
      } else {
        response.ok.header("Access-Control-Allow-Origin", "*").json(ImgUpdateResp("fail", "success", "")).toFuture
      }
    }

  }

}
