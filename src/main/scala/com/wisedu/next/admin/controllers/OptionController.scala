package com.wisedu.next.admin.controllers

import com.twitter.finagle.http.Request
import com.twitter.finatra.http.Controller

/**
 * OptionController
 *
 * @author croyson
 *         contact 14116004@wisedu.com
 *         date 16/9/19
 */
class OptionController extends Controller {
  options("/v2/:*") { request: Request =>
    val domain = request.headerMap.getOrElse("Origin","")
    response.accepted.headers(Map("Access-Control-Allow-Origin"-> domain,
      "Access-Control-Allow-Credentials" ->"true","Access-Control-Allow-Methods"-> "POST,GET,OPTIONS,DELETE",
      "Access-Control-Allow-Headers"-> "Origin, X-Requested-With,accept, authorization,Content-Type,sessionToken,tenantId"))

  }
}
