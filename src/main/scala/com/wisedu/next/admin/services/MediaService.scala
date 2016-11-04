package com.wisedu.next.admin.services

import javax.inject.{Inject, Singleton}

import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.models.Service
import com.wisedu.next.services.{CollegeBaseService, ServiceBaseService}
import org.joda.time.DateTime


@Singleton
class MediaService {
  @Inject var serviceBaseService: ServiceBaseService = _
  @Inject var sysCodeService: SysCodeService = _
  @Inject var collegeBaseService: CollegeBaseService = _

  //新增校园媒体号
  def addService(request: MediaAddReq): Future[Boolean] = {
    try {
      val organizationType = if (request.organizationType.isEmpty) 0 else request.organizationType.toInt
      val sourceType = if (request.sourceType.isEmpty) 0 else request.sourceType.toInt
      val sortNum = if (request.sortNum.isEmpty) 0 else request.sortNum.toInt
      val isDisplay = if (request.isDisplay.isEmpty) 1 else request.isDisplay.toInt
      val service = Service(request.campusMediaId, request.campusMediaName, organizationType, request.source,
        sourceType, request.campusMediaLogo, request.backgroundImg, request.description,
        DateTime.now(), DateTime.now(), request.collegeId, sortNum,isDisplay)
      serviceBaseService.insService(service).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //修改校园媒体号
  def modifyService(request: MediaModifyReq): Future[Boolean] = {
    try {
      val organizationType = if (request.organizationType.isEmpty) 0 else request.organizationType.toInt
      val sourceType = if (request.sourceType.isEmpty) 0 else request.sourceType.toInt
      val sortNum = if (request.sortNum.isEmpty) 0 else request.sortNum.toInt
      val isDisplay = if (request.isDisplay.isEmpty) 1 else request.isDisplay.toInt
      val service = Service(request.campusMediaId, request.campusMediaName, organizationType, request.source,
        sourceType, request.campusMediaLogo, request.backgroundImg, request.description,
        DateTime.now(), DateTime.now(), request.collegeId, sortNum,isDisplay)
      serviceBaseService.updService(service).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //删除校园媒体号
  def deleteServices(request: MediaDeleteReq): Future[Boolean] = {
    try {
      Future.collect(
        request.campusMediaId.split(",").map {
          item => serviceBaseService.delServiceById(item)
        }).map {
        rst => true
      }

    } catch {
      case _: Exception => Future(false)
    }
  }

  //获取一个校园媒体号
  def getService(request: MediaReq): Future[MediaResp] = {
    serviceBaseService.getServiceById(request.campusMediaId).map {
      case Some(service) => MediaResp("success", "", Some(MediaInfo(service.serId.toString, service.name,
        service.srcType.toString, service.srcId, service.orgType.toString, service.depict, service.imgUrl,
        service.backImgUrl, service.collegeId, service.sortNo.toString,service.isDisplay.toString)))
      case None => MediaResp("failed", "not exist!", None) //不存在返回失败
    }
  }

  //获取媒体号列表数据
  def getServices(request: MediasReq): Future[MediaListResp] = {
    serviceBaseService.collServicePageList(request.campusMediaName, request.sourceType, request.organizationType,
      request.pageSize, (request.pageNumber - 1) * request.pageSize).flatMap {
      servicePage => {
        Future.collect(servicePage._1.map {
          service => {
            val crawlerStateF = serviceBaseService.getServiceCrawlerById(service.serId).map {
              case Some(serviceCraw) => (serviceCraw.crawlers.getOrElse("get_wechat_articles", "未抓取"), serviceCraw.crawlers.getOrElse("last_update_time",""))
              case None => ("未抓取","")
            }
            val orgTypeF = sysCodeService.getDisplay(service.orgType.toString, "school_no_org_type")
            val sourceTypeF = sysCodeService.getDisplay(service.srcType.toString, "school_no_source_type")
            val collegeF = if (service.collegeId.nonEmpty)
              collegeBaseService.getCollegeById(service.collegeId).map {
                case Some(college) => college.name
                case None => ""
              } else {
              Future("")
            }
            for {
              crawlerState <- crawlerStateF
              orgType <- orgTypeF
              sourceType <- sourceTypeF
              college <- collegeF
            } yield MediaItem(service.serId.toString, service.imgUrl, service.name, service.srcId, sourceType, orgType, crawlerState._2, crawlerState._1,
              college)
          }
        })
      }.map {
        item => MediaListResp("0", MediaData(MediaList(request.pageNumber, servicePage._2, request.pageSize, item)))
      }
    }

  }

  //验证校园号是否存在  返回true 说明不存在能用 false  存在不能用
  def validMediaId(request: MediaValidIdReq): Future[Boolean] = {
    val campusMediaId = request.campusMediaId
    serviceBaseService.getServiceById(campusMediaId).map {
      case Some(tag) => false
      case None => true
    }

  }


  //获取所有的校园号 (选择的时候用)
  def getMediaCodes: Future[MediaCodesResp] = {
    serviceBaseService.collServices(1000, 0).map {
      services => MediaCodesResp("0", MediaCodesInfo(MediaCodeRow(services.map {
        service => MediaCodeItem(service.serId, service.name)
      })))
    }
  }

}
