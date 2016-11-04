package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finagle.http.Request
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains.{RawlerExcRequest, RawlerExcResponse, RawlerStatusResponse}
import com.wisedu.next.admin.services.RawlerFunctions

/**
 * RawlerExcController
 *
 * @author croyson
 */
class RawlerExcController extends Controller {

  @Inject var rawlerExcService: RawlerFunctions = _

  post("/v2/rawlerexe") { request: RawlerExcRequest =>
    rawlerExcService.execWxRawler(request).map {
      _ => response.ok.header("Access-Control-Allow-Origin", "*").json(RawlerExcResponse("success", ""))
    }
  }

  post("/v2/rawlerexe_kill") { request: RawlerExcRequest =>
    rawlerExcService.execWxRawlerKill(request).map {
      _ => response.ok.header("Access-Control-Allow-Origin", "*").json(RawlerExcResponse("success", ""))
    }
  }

  post("/v2/rawlerexe_all") { request: Request =>
    rawlerExcService.execWxRawlerAll.map {
      _ => response.ok.header("Access-Control-Allow-Origin", "*").json(RawlerExcResponse("success", ""))
    }
  }

  get("/v2/rawlers_status") { request: Request =>
    rawlerExcService.getWxRawlersStatus.map {
      status => response.ok.header("Access-Control-Allow-Origin", "*").json(RawlerStatusResponse("success",status, ""))
    }
  }
}
