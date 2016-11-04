package com.wisedu.next.admin.domains

case class AdminUserLoginRes(userId: String,status:String,errMsg:String,token:String)


case class PostAdminUserLoginRes(loginInfo: AdminUserLoginRes)