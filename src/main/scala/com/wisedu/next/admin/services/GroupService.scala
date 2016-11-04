package com.wisedu.next.admin.services

import java.text.SimpleDateFormat
import javax.inject.{Inject, Singleton}

import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.models.{Group, GroupPermission}
import com.wisedu.next.services._
import org.joda.time.DateTime

@Singleton
class GroupService {

  @Inject var groupBaseService: GroupBaseService = _
  @Inject var tagBaseService: TagBaseService = _
  @Inject var sysCodeService: SysCodeService = _
  @Inject var collegeBaseService: CollegeBaseService = _
  @Inject var feedBaseService: FeedBaseService = _
  @Inject var serviceBaseService: ServiceBaseService = _
  @Inject var feedAndStatsBaseService: FeedAndStatsBaseService = _

  //新增虚拟组
  def addGroup(request: GroupAddReq): Future[Boolean] = {
    //封装 group 数据
    val groupType = if (request.groupType.isEmpty) 0 else request.groupType.toInt
    val strutsType = if (request.strutsType.isEmpty) 0 else request.strutsType.toInt
    val sortNum = if (request.sortNum.isEmpty) 0 else request.sortNum.toInt
    val isAnonymous = if (request.isAnonymous.isEmpty) 0 else request.isAnonymous.toInt
    val permissionsLimit = if (request.permissionsLimit.isEmpty) 0 else request.permissionsLimit.toInt
    val aggregationGroup = if (request.aggregationGroup.isEmpty) 0 else request.aggregationGroup.toInt
    val startTime = if (request.startTime.isEmpty) DateTime.now else new DateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(request.startTime))
    val endTime = if (request.endTime.isEmpty) DateTime.now else new DateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(request.endTime))
    val group = Group(request.groupId, request.groupName, request.description, request.contentTypeLimit,
      request.tagLimit, groupType, request.logo, request.backgroundImg, startTime, endTime,
      sortNum, aggregationGroup, request.groupParam, strutsType,permissionsLimit,request.posterGroupId,isAnonymous)
    try {
      groupBaseService.addGroup(group).map {
        result => {
          if (request.permissionsLimit.equals("1")) {
            //分装虚拟组权限数据
            request.schoolLimit.split(",").map {
              item => groupBaseService.addGroupPermission(GroupPermission(request.groupId, item, 1))
            }
          }
          true
        }
      }
    } catch {
      case _: Exception => Future(false)
    }

  }

  //修改虚拟组
  def modifyGroup(request: GroupModifyReq): Future[Boolean] = {
    //封装 group 数据
    val groupType = if (request.groupType.isEmpty) 0 else request.groupType.toInt
    val strutsType = if (request.strutsType.isEmpty) 0 else request.strutsType.toInt
    val sortNum = if (request.sortNum.isEmpty) 0 else request.sortNum.toInt
    val isAnonymous = if (request.isAnonymous.isEmpty) 0 else request.isAnonymous.toInt
    val aggregationGroup = if (request.aggregationGroup.isEmpty) 0 else request.aggregationGroup.toInt
    val startTime = if (request.startTime.isEmpty) DateTime.now else new DateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(request.startTime))
    val endTime = if (request.endTime.isEmpty) DateTime.now else new DateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(request.endTime))
    val permissionsLimit = if (request.permissionsLimit.isEmpty) 0 else request.permissionsLimit.toInt
    val group = Group(request.groupId, request.groupName, request.description, request.contentTypeLimit,
      request.tagLimit, groupType, request.logo, request.backgroundImg, startTime, endTime,
      sortNum , aggregationGroup, request.groupParam,strutsType,permissionsLimit,request.posterGroupId,
      isAnonymous)
    try {
      groupBaseService.updGroup(group).map {
        result => {
          //刪除虚拟组权限明细,重新添加
          groupBaseService.delPermissionsByGroupId(request.groupId)
          if (request.permissionsLimit.equals("1")) {
            //分装虚拟组权限数据
            request.schoolLimit.split(",").map {
              item => groupBaseService.addGroupPermission(GroupPermission(request.groupId, item, 1))
            }
          }
          true
        }
      }
    } catch {
      case _: Exception => Future(false)
    }

  }

  //获取一个虚拟组
  def getGroupById(groupId: String): Future[GroupResp] = {
    groupBaseService.getGroupById(groupId).flatMap {
      case Some(group) =>
        groupBaseService.getPermissionsByGroupId(groupId).map {
          permissions => if (permissions.isEmpty) {
            GroupResp("success", "", Some(GroupInfo(group.groupId, group.groupName, group.groupType.toString, group.feedTypeCL,
              group.tagCL,group.permissionsLimit.toString, "", group.description, group.sortNo.toString, group.groupParam, group.iconUrl, group.backImgUrl, group.sTime.toString("yyyy-MM-dd HH:mm"),
              group.eTime.toString("yyyy-MM-dd HH:mm"), group.isSumGroup.toString, group.strutsType.toString,group.posterGroupId,group.isAnonymous.toString)))
          } else {
            val schoolLimit = new StringBuilder()
            permissions.map {
              permission => schoolLimit.append(permission.collegeId.toString).append(",")
            }
            GroupResp("success", "", Some(GroupInfo(group.groupId, group.groupName, group.groupType.toString, group.feedTypeCL,
              group.tagCL, group.permissionsLimit.toString, schoolLimit.substring(0, schoolLimit.length - 1).toString
              , group.description, group.sortNo.toString, group.groupParam, group.iconUrl, group.backImgUrl, group.sTime.toString("yyyy-MM-dd HH:mm"),
              group.eTime.toString("yyyy-MM-dd HH:mm"), group.isSumGroup.toString, group.strutsType.toString,group.posterGroupId,group.isAnonymous.toString)))
          }
        }

      case None => Future(GroupResp("failed", "not exist!", None)) //不存在返回失败
    }
  }

  //获取虚拟组列表
  def getGroups(request: GroupsReq): Future[GroupListResp] = {
    // 查询分页数据
    groupBaseService.collGroupPageList("",request.groupName.getOrElse(""), request.groupType.getOrElse(""),
      request.pageSize, (request.pageNumber - 1) * request.pageSize).flatMap {
      groupPage => {
        Future.collect(groupPage._1.map {
          group => {
            val groupTypeF = sysCodeService.getDisplay(group.groupType.toString, "group_type")
            val feedTypesF = Future.collect(group.feedTypeCL.split(",").map {
              typeId => sysCodeService.getDisplay(typeId, "content_type")
            })
            val tagsF = Future.collect(group.tagCL.split(",").map {
              tagId => tagBaseService.getTagById(tagId).map {
                case Some(tag) => tag.tagName
                case None => ""
              }
            })
            val permissionsF = groupBaseService.getPermissionsByGroupId(group.groupId).flatMap {
              permissions => Future.collect(permissions.map {
                  permission => sysCodeService.getDisplay(permission.collegeId, "group_limit")
              })
            }
            val aggregationGroupF = sysCodeService.getDisplay(group.isSumGroup.toString, "yn_state")
            for {
              groupType <- groupTypeF
              feedTypes <- feedTypesF
              tags <- tagsF
              permissions <- permissionsF
              aggregationGroup <- aggregationGroupF
            } yield GroupItem(group.groupId, group.groupName, groupType, feedTypes.mkString(","),
              tags.mkString(","), permissions.mkString(","), aggregationGroup, group.sTime.toString("yyyy-MM-dd HH:mm"),
              group.eTime.toString("yyyy-MM-dd HH:mm"), group.sortNo.toString, group.strutsType.toString,group.description)
          }
        })
      }.map {
        item => GroupListResp("0", GroupData(GroupList(request.pageNumber, groupPage._2, request.pageSize, item)))
      }
    }
  }

  //删除虚拟组
  def deleteGroups(request: GroupDeleteReq): Future[Boolean] = {
    val groupIds = request.groupId
    try {
      Future.collect(groupIds.split(",").map {
        id => groupBaseService.delGroupById(id)
      }).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //验证虚拟组是否存在  返回true 说明不存在能用 false  存在不能用
  def validGroupId(request: GroupValidIdReq): Future[Boolean] = {
    val groupIds = request.groupId
    groupBaseService.getGroupById(groupIds).map {
      case Some(group) => false
      case None => true
    }

  }

  //获取所有的标签 (选择的时候用)
  def getGroupCodes(groupType: String): Future[GroupCodesResp] = {
    groupBaseService.collGroup("","", groupType, 1000, 0).map {
      groups => GroupCodesResp("0", GroupCodesInfo(GroupCodeRow(groups.map {
        group => GroupCodeItem(group.groupId, group.groupName+"("+group.groupId+")")
      })))
    }
  }

  def getLives(request: GroupLiveReq): Future[GroupLiveResp] = {
    val limits = request.pageSize
    val offset = (request.pageNumber - 1) * request.pageSize
    val liveGroupId = "zbpd"
    groupBaseService.getGroupById(liveGroupId).flatMap {
      case Some(group) =>
        feedAndStatsBaseService.collFeeds(liveGroupId, "", "1", "", offset, limits,"").flatMap{
          feedAndStats => Future.collect(feedAndStats.map {
            feed => serviceBaseService.getServiceById(feed.serId).map {
              case Some(service) => GroupLiveItem(feed.feedId.toString, feed.title, feed.cTime.toString("yyyy-MM-dd HH:mm:ss"),
                feed.mTime.toString("yyyy-MM-dd HH:mm:ss"),feed.readNum.toString, feed.updateNum.toString,
                feed.likeNum.toString, service.name, service.imgUrl, feed.summ,feed.imgNum.toString,feed.onlineNum.toString,
                feed.liveStatus.toString, feed.liveStartTime.toString("yyyy-MM-dd HH:mm:ss"), feed.srcUrl, feed.videoLength,if(feed.liveStatus == 2 )feed.contUrl else feed.videoAddr,
                feed.sImgUrl.split(",")(0))
              case None =>  GroupLiveItem(feed.feedId.toString, feed.title, feed.cTime.toString("yyyy-MM-dd HH:mm:ss"),
                feed.mTime.toString("yyyy-MM-dd HH:mm:ss"),feed.readNum.toString, feed.updateNum.toString,
                feed.likeNum.toString, "","", feed.summ,feed.imgNum.toString,feed.onlineNum.toString,
                feed.liveStatus.toString, feed.liveStartTime.toString("yyyy-MM-dd HH:mm:ss"), feed.srcUrl, feed.videoLength,if(feed.liveStatus == 2 )feed.contUrl else feed.videoAddr,
                feed.sImgUrl.split(",")(0))
            }
          }).map(item => GroupLiveResp(item))
        }
      case  None => Future(GroupLiveResp(null))
    }

  }

}