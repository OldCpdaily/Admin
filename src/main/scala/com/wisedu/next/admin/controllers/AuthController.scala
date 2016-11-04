package com.wisedu.next.admin.controllers

/**
 * AuthController
 *
 * @author croyson
 *         contact 14116004@wisedu.com
 *         date 16/4/25
 */

import javax.inject.Inject

import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains.{AdminUserLoginRes, PostAdminUserAuthRequest, PostAdminUserLoginRes}
import com.wisedu.next.admin.services.AdminUserService

class AuthController extends Controller {

  @Inject var adminUserFunctions: AdminUserService = _


  post("/v2/auth/admin/tokens") { request: PostAdminUserAuthRequest =>

      adminUserFunctions.verifyLoginInfo(request.userId,request.password).flatMap{
      item=> if(item){
        adminUserFunctions.getToken(request.userId).map{
          token => {
            response.ok.header("Access-Control-Allow-Origin", "*").json(PostAdminUserLoginRes(AdminUserLoginRes(request.userId, "success", "登录成功", token)))
            }
          }
      }else{
        response.ok.header("Access-Control-Allow-Origin", "*").json(PostAdminUserLoginRes(AdminUserLoginRes(request.userId,"fail","登录失败",""))).toFuture
      }
    }

  }
}