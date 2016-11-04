package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.UserService

/**
 * CollegeController
 *
 * @author croyson
 */
class UserController extends Controller {

  @Inject var userService: UserService = _

  //获取用戶
  get("/v2/users") { request: UsersReq =>
      userService.collUserPageList(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

}
