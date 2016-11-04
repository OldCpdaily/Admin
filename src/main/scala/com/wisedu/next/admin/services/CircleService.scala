package com.wisedu.next.admin.services

import javax.inject.{Inject, Singleton}

import com.twitter.finatra.json.FinatraObjectMapper
import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.models.{Circle, CirclePermission}
import com.wisedu.next.services._

@Singleton
class CircleService {

  @Inject var circleBaseService: CirclesBaseService = _
  @Inject var tagBaseService: TagBaseService = _
  @Inject var sysCodeService: SysCodeService = _
  @Inject var collegeBaseService: CollegeBaseService = _
  @Inject var feedBaseService: FeedBaseService = _
  @Inject var serviceBaseService: ServiceBaseService = _
  @Inject var feedAndStatsBaseService: FeedAndStatsBaseService = _
  @Inject var objectMapper: FinatraObjectMapper = _
  //新增虚拟组
  def addCircle(request: CircleAddReq): Future[Boolean] = {
    //封装 circle 数据
    val circleType = if (request.circleType.isEmpty) 0 else request.circleType.toInt
    val strutsType = if (request.strutsType.isEmpty) 0 else request.strutsType.toInt
    val sortNum = if (request.sortNum.isEmpty) 0 else request.sortNum.toInt
    val sortStrategy = if (request.sortStrategy.isEmpty) 0 else request.sortStrategy.toInt
    val isAnonymous = if (request.isAnonymous.isEmpty) 0 else request.isAnonymous.toInt
    val permissionsLimit = if (request.permissionsLimit.isEmpty) 0 else request.permissionsLimit.toInt
    val isRealNamePost = if (request.isRealNamePost.isEmpty) 0 else request.isRealNamePost.toInt
    val isRealNameRespond = if (request.isRealNameRespond.isEmpty) 0 else request.isRealNameRespond.toInt
    val circle = Circle(request.circleId, request.circleName, request.description,circleType,strutsType,
    request.logo,request.backgroundImg,sortNum,sortStrategy,permissionsLimit,request.posterGroupId,
    request.topMessages,isAnonymous,isRealNamePost,isRealNameRespond,request.notice,request.adminUser)
      circleBaseService.addCircle(circle).map {
        result => {
          if (request.permissionsLimit.equals("1")) {
            //分装虚拟组权限数据
            if(request.limits.nonEmpty){
              val limits = objectMapper.parse[Seq[CircleLimit]](request.limits)
              limits.map {
                item => circleBaseService.addCirclePermission(CirclePermission(request.circleId,item.schoolId,item.isDefaultDisPlay,item.isDefaultSave))
              }
            }

          }
          true
        }
      }.rescue {
        case _: Exception => Future(false)
      }

  }

  //修改虚拟组
  def modifyCircle(request: CircleModifyReq): Future[Boolean] = {
    //封装 circle 数据
    val circleType = if (request.circleType.isEmpty) 0 else request.circleType.toInt
    val strutsType = if (request.strutsType.isEmpty) 0 else request.strutsType.toInt
    val sortNum = if (request.sortNum.isEmpty) 0 else request.sortNum.toInt
    val sortStrategy = if (request.sortStrategy.isEmpty) 0 else request.sortStrategy.toInt
    val isAnonymous = if (request.isAnonymous.isEmpty) 0 else request.isAnonymous.toInt
    val permissionsLimit = if (request.permissionsLimit.isEmpty) 0 else request.permissionsLimit.toInt
    val isRealNamePost = if (request.isRealNamePost.isEmpty) 0 else request.isRealNamePost.toInt
    val isRealNameRespond = if (request.isRealNameRespond.isEmpty) 0 else request.isRealNameRespond.toInt
    val circle = Circle(request.circleId, request.circleName, request.description,circleType,strutsType,
      request.logo,request.backgroundImg,sortNum,sortStrategy,permissionsLimit,request.posterGroupId,
      request.topMessages,isAnonymous,isRealNamePost,isRealNameRespond,request.notice,request.adminUser)
      circleBaseService.updCircle(circle).map {
        result => {
          //刪除虚拟组权限明细,重新添加
          circleBaseService.delPermissionsByCircleId(request.circleId).map {
            rst => if (request.permissionsLimit.equals("1")) {
              //分装虚拟组权限数据
              if (request.limits.nonEmpty) {
                val limits = objectMapper.parse[Seq[CircleLimit]](request.limits)
                limits.map {
                  item => circleBaseService.addCirclePermission(CirclePermission(request.circleId, item.schoolId, item.isDefaultDisPlay, item.isDefaultSave))
                }
              }
            }
          }
          true
        }
      }.rescue {
        case _: Exception => Future(false)
      }

  }

  //获取一个圈子
  def getCircleById(circleId: String): Future[CircleResp] = {
    circleBaseService.getCircleById(circleId).flatMap {
      case Some(circle) =>
        circleBaseService.getPermissionsByCircleId(circleId).flatMap{
          permissions => if (permissions.isEmpty) {
            Future(CircleResp("success", "", Some(CircleInfo(circle.circleId, circle.circleName,circle.description,circle.circleType.toString,circle.strutsType.toString,
              circle.sortNo.toString,"",circle.permissionsLimit.toString,circle.iconUrl,"",circle.backImgUrl,circle.sortStrategy.toString,circle.posterGroupId,circle.topMessages,circle.isAnonymous.toString,
            circle.isRealNamePost.toString,circle.isRealNameRespond.toString,circle.notice,circle.adminUser))))
          } else {
            Future.collect(permissions.map {
              permission => sysCodeService.getDisplay(permission.collegeId, "group_limit").map{
               item => CircleLimit(permission.collegeId,item,permission.isDefaultDisPlay,permission.isDefaultSave)
              }
            }).map(
              limits =>{
               val collegeId =  permissions.map{
                  item => item.collegeId
                }
                CircleResp("success", "",Some(CircleInfo(circle.circleId, circle.circleName,circle.description,circle.circleType.toString,circle.strutsType.toString,
                circle.sortNo.toString,collegeId.mkString(","),circle.permissionsLimit.toString,circle.iconUrl,
                objectMapper.writePrettyString(limits),circle.backImgUrl,circle.sortStrategy.toString,circle.posterGroupId,circle.topMessages,circle.isAnonymous.toString,
                circle.isRealNamePost.toString,circle.isRealNameRespond.toString,circle.notice,circle.adminUser)))
              })
          }
        }
      case None => Future(CircleResp("failed", "not exist!", None)) //不存在返回失败
    }
  }

  //获取圈子列表列表
  def getCircles(request: CirclesReq): Future[CircleListResp] = {
    // 查询分页数据
    circleBaseService.collCirclesPageList("",request.circleName.getOrElse(""), request.circleType.getOrElse(""),
      request.strutsType.getOrElse(""), request.pageSize, (request.pageNumber - 1) * request.pageSize).flatMap {
      circlePage => {
        Future.collect(circlePage._1.map {
          circle => {
            val circleTypeF = sysCodeService.getDisplay(circle.circleType.toString, "circleType")
            val strutsTypeF = sysCodeService.getDisplay(circle.strutsType.toString, "circleStrutsType")
            val permissionsF = circleBaseService.getPermissionsByCircleId(circle.circleId).flatMap {
              permissions => Future.collect(permissions.map {
                permission => sysCodeService.getDisplay(permission.collegeId, "group_limit")
              })
            }
            val isRealNameRespondF = sysCodeService.getDisplay(circle.isRealNameRespond.toString, "yn_state")
            val isRealNamePostF = sysCodeService.getDisplay(circle.isRealNamePost.toString, "yn_state")
            val isAnonymousF = sysCodeService.getDisplay(circle.isAnonymous.toString, "yn_state")

            for {
              circleType <- circleTypeF
              permissions <- permissionsF
              isRealNameRespond <- isRealNameRespondF
              isRealNamePost <- isRealNamePostF
              isAnonymous <- isAnonymousF
              strutsType <- strutsTypeF
            } yield CircleItem(circle.circleId, circle.circleName,circle.description,circleType,strutsType,
              circle.sortNo.toString,permissions.mkString(","),circle.iconUrl,circle.backImgUrl,
              circle.sortStrategy.toString,circle.posterGroupId,circle.topMessages,isAnonymous,
              isRealNamePost,isRealNameRespond)
          }
        })
      }.map {
        item => CircleListResp("0", CircleData(CircleList(request.pageNumber, circlePage._2, request.pageSize, item)))
      }
    }
  }

  //删除圈子
  def deleteCircles(request: CircleDeleteReq): Future[Boolean] = {
    val circleIds = request.circleId
      Future.collect(circleIds.split(",").map {
        id => circleBaseService.delCircleById(id)
      }).map {
        rst => true
      }.rescue {
        case _: Exception => Future(false)
      }

  }


  //验证虚拟组是否存在  返回true 说明不存在能用 false  存在不能用
  def validCircleId(request: CircleValidIdReq): Future[Boolean] = {
    val circleId = request.circleId
    circleBaseService.getCircleById(circleId).map {
      case Some(circle) => false
      case None => true
    }

  }
}