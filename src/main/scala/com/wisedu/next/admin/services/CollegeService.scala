package com.wisedu.next.admin.services

import javax.inject.{Inject, Singleton}

import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.models.{Depart, College}
import com.wisedu.next.services.CollegeBaseService

@Singleton
class CollegeService {
  @Inject var collegeBaseService: CollegeBaseService = _

  //获取所有的学校 (选择的时候用)
  def getCollegeCodes(request: CollegeNamesReq): Future[CollegeCodesResp] = {

    collegeBaseService.collAllColleges().map {
      colleges => CollegeCodesResp("0", CollegeCode(CollegeRow(colleges.map {
        college => CollegeCodeItem(college.collegeId.toString, college.name)
      })))
    }
  }

  //新增学校
  def addCollege(request: CollegeAddReq): Future[Boolean] = {
    try {
      val college = College(request.collegeId,request.name, request.eName, request.shortName, request.imgUrl,
        request.lat.toFloat, request.lng.toFloat, request.addr, 0, request.region, 0)
      collegeBaseService.insCollege(college).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //修改学校
  def modifyCollege(request: CollegeModifyReq): Future[Boolean] = {
    try {
      val college = College(request.collegeId, request.name, request.eName, request.shortName, request.imgUrl,
        request.lat.toFloat, request.lng.toFloat, request.addr, 0, request.region, 0)
      collegeBaseService.updCollege(college).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //删除学校
  def deleteColleges(request: CollegeDeleteReq): Future[Boolean] = {
    try {
      Future.collect(
        request.collegeId.split(",").map {
          item => collegeBaseService.delCollegeById(item)
        }).map {
        rst => true
      }

    } catch {
      case _: Exception => Future(false)
    }
  }

  //获取一个学校
  def getCollege(request: CollegeReq): Future[CollegeResp] = {
    collegeBaseService.getCollegeById(request.collegeId).map {
      case Some(college) => CollegeResp("success", "", Some(CollegeInfo(college.collegeId.toString, college.name,
        college.eName, college.shortName, college.imgUrl, college.lat.toString, college.lng.toString, college.addr, college.region)))
      case None => CollegeResp("failed", "not exist!", None) //不存在返回失败
    }
  }

  //获取学校列表数据
  def getColleges(request: CollegesReq): Future[CollegeListResp] = {
    collegeBaseService.collCollegePageList(request.pageSize, (request.pageNumber - 1) * request.pageSize, request.region).map {
      CollegePage => {
        CollegeListResp("0", CollegeData(CollegeList(request.pageNumber, CollegePage._2, request.pageSize, CollegePage._1.map {
          college => {
            CollegeItem(college.collegeId.toString, college.name,
              college.eName, college.shortName, college.imgUrl, college.lat.toString, college.lng.toString, college.addr, college.region)
          }
        })))
      }
    }

  }

  //新增院系
  def addDepart(request: DepartAddReq): Future[Boolean] = {
    try {
      val depart = Depart(request.departId,request.collegeId,request.departName,request.descr,request.sortNo.toInt,
      request.departShortName,"")
      collegeBaseService.insDepart(depart).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //修改院系
  def modifyDepart(request: DepartModifyReq): Future[Boolean] = {
    try {
      val depart = Depart(request.departId,request.collegeId,request.departName,request.descr,request.sortNo.toInt,
        request.departShortName,"")
      collegeBaseService.updDepart(depart).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //删除学校
  def deleteDepart(request: DepartDeleteReq): Future[Boolean] = {
    try {
      Future.collect(
        request.departId.split(",").map {
          item => collegeBaseService.delDepart(item)
        }).map {
        rst => true
      }

    } catch {
      case _: Exception => Future(false)
    }
  }




}