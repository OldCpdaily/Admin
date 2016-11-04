package com.wisedu.next.admin.services

import javax.inject.{Inject, Singleton}

import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.models.{Tag, TagStruct}
import com.wisedu.next.services.TagBaseService
import org.joda.time.DateTime

/**
 * Created by croyson on 2016/5/20
 */

@Singleton
class TagService {
  @Inject var tagBaseService: TagBaseService = _
  @Inject var sysCodeService: SysCodeService = _

  //新增标签
  def addTag(request: TagAddReq): Future[Boolean] = {
    try {
      val tag = Tag(request.tagId, request.tagName, request.tagType.toInt, request.tagLevel.toInt, request.enabled.toInt, request.isShown.toInt, DateTime.now,
        DateTime.now, DateTime.now, request.description, request.extendInfo, "", 0, request.tagDomain.toInt)
      tagBaseService.insTag(tag).map {
        rst =>{
          tagBaseService.insTagStruct(TagStruct(request.tagId,request.createUser, DateTime.now))
          true
        }
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //修改标签
  def modifyTag(request: TagModifyReq): Future[Boolean] = {
    try {
      val tag = Tag(request.tagId, request.tagName, request.tagType.toInt, request.tagLevel.toInt, request.enabled.toInt, request.isShown.toInt, DateTime.now,
        DateTime.now, DateTime.now, request.description, request.extendInfo, "", 0, request.tagDomain.toInt)
      tagBaseService.updTag(tag).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //删除标签
  def deleteTags(request: TagDeleteReq): Future[Boolean] = {
    try {
      Future.collect(
        request.tagId.split(",").map {
          item => tagBaseService.delById(item)
        }).map {
        rst => true
      }

    } catch {
      case _: Exception => Future(false)
    }
  }

  //获取一个标签
  def getTag(request: TagReq): Future[TagResp] = {
    tagBaseService.getTagById(request.tagId).map {
      case Some(tag) => TagResp("success", "", Some(TagInfo(tag.tagId.toString, tag.tagName, tag.tagType.toString, tag.tagLevel.toString,
        tag.tagStatus.toString,tag.tagDomain.toString,tag.description,tag.extension, tag.isDisplay.toString, tag.cTime.toString(), "", tag.mTime.toString)))
      case None => TagResp("failed", "not exist!", None) //不存在返回失败
    }
  }

  //获取标签列表数据
  def getTags(request: TagsReq): Future[TagListResp] = {
    tagBaseService.collTagPageList(request.tagDomain.toInt, request.pageSize, (request.pageNumber - 1) * request.pageSize).flatMap {
      tagPage => {
        Future.collect(tagPage._1.map {
          tag => {
            val tagTypeF = sysCodeService.getDisplay(tag.tagType.toString, "tag_type")
            val tagLevelF = sysCodeService.getDisplay(tag.tagLevel.toString, "tag_level")
            val enableF = sysCodeService.getDisplay(tag.tagLevel.toString, "enable_status")
            val yesNoF = sysCodeService.getDisplay(tag.tagLevel.toString, "yn_state")
            val createUserF =  tagBaseService.getTagStructById(tag.tagId).map{
              case Some(tagStruct) => tagStruct.userId
              case None => "admin"
             }
            for {
              tagType <- tagTypeF
              tagLevel <- tagLevelF
              enable <- enableF
              yesNo <- yesNoF
              createUser <- createUserF
            } yield TagItem(tag.tagId.toString, tag.tagName, tagType,tagLevel , tag.feedNum.toString,
              enable, yesNo, tag.cTime.toString("yyyy-MM-dd HH:mm"), createUser, tag.mTime.toString("yyyy-MM-dd HH:mm"))
          }
        })
      }.map {
        item => TagListResp("0", TagData(TagList(request.pageNumber, tagPage._2, request.pageSize, item)))
      }
    }

  }

  //验证标签是否存在  返回true 说明不存在能用 false  存在不能用
  def validTagId(request: TagValidIdReq): Future[Boolean] = {
    val tagId = request.tagId
    tagBaseService.getTagById(tagId).map {
      case Some(tag) => false
      case None => true
    }

  }

  //获取所有的标签 (选择的时候用)
  def getTagCodes(request: TagsGetReq): Future[TagCodesResp] = {

    tagBaseService.collDomainEnabledTag(request.tagDomain.toInt).map{
      tags => TagCodesResp("0",TagCodesInfo(TagCodeRow(tags.map{
        tag => TagCodeItem(tag.tagId,tag.tagName+"("+tag.tagId+")")
      })))
    }
  }


}
