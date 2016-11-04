package com.wisedu.next.admin.services

import javax.inject.{Inject, Singleton}

import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.services.{CollegeBaseService, TagBaseService, UserBaseService}

@Singleton
class UserService {
  @Inject var userBaseService: UserBaseService = _
  @Inject var tagBaseService: TagBaseService = _
  @Inject var sysCodeService: SysCodeService = _
  @Inject var collegeBaseService: CollegeBaseService = _

  def collUserPageList(request: UsersReq): Future[UserListResp] = {
    userBaseService.collUserPageList(request.userName.getOrElse(""), request.isAnonymousUser.getOrElse(""),
      request.userStatus.getOrElse(""), request.userTag.getOrElse(""),
       (request.pageNumber - 1) * request.pageSize,request.pageSize).flatMap {
      case (users, userSize) =>
        Future.collect(users.map {
          user => {
            val sex = user.sex match {
              case 0 => "未知"
              case 1 => "男"
              case 2 => "女"
            }
            val isAnonymousUser = user.isAnonymousUser match {
              case 0 => "否"
              case 1 => "是"
            }
            val userStatus = user.status match {
              case 0 => "停用"
              case 1 => "启用"
            }

            val tagNamesF = userBaseService.getUserTagsByUserId(user.userId).flatMap {
              userTags => Future.collect(userTags.map {
                userTag => tagBaseService.getTagById(userTag.tagId).map {
                  case Some(tag) => tag.tagName
                  case None => ""
                }
              })

            }
            val departF = collegeBaseService.getDepartById(user.depart).map{
              case Some(depart) => depart.departName
              case None => ""
            }
            for {
              tagName <- tagNamesF
              depart <- departF
            } yield UserItem(user.userId.toString, user.alias,user.name, isAnonymousUser, userStatus, tagName.mkString(","), sex,
              user.phoneNo, user.collegeName,depart, user.cTime.toString("yyyy-MM-dd HH:mm"), "")
          }
        }).map {
          items => UserListResp("0", UserData(UserList(request.pageNumber, userSize, request.pageSize, items)))
        }

    }
  }
}