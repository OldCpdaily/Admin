package com.wisedu.next.admin.services

import javax.inject.{Inject, Singleton}

import com.twitter.util.Future
import com.wisedu.next.models.AdminToken
import com.wisedu.next.services.AdminUserBaseService

@Singleton
class AdminUserService {
  @Inject var adminUserBaseService: AdminUserBaseService = _

  def verifyLoginInfo(userId:String,password:String): Future[Boolean] ={
    adminUserBaseService.verifyLoginInfo(userId,password)
  }

  def getToken(userId:String):Future[String]={
    adminUserBaseService.getToken(userId)
  }

  def getByTokens(tokens:String):Future[Option[AdminToken]]={
    adminUserBaseService.getByTokens(tokens)
  }
}