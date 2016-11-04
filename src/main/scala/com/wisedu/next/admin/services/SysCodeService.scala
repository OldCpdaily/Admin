package com.wisedu.next.admin.services

import javax.inject.{Inject, Singleton}

import com.twitter.util.Future
import com.wisedu.next.admin.domains._
import com.wisedu.next.models.SysCode
import com.wisedu.next.services.SysCodeBaseService

@Singleton
class SysCodeService {

  @Inject var sysCodeBaseService: SysCodeBaseService = _

  //新增码表信息
  def addSysCode(request: SysCodeAddReq): Future[Boolean] = {
    try {
      val sysCode = SysCode(request.value, request.display, request.typeId, "", request.sortNum, request.description)
      sysCodeBaseService.addSysCode(sysCode).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //更新码表信息
  def updateSysCode(request: SysCodeModifyReq): Future[Boolean] = {
    try {
      val sysCode = SysCode(request.value, request.display, request.typeId, "", request.sortNum, request.description)
      sysCodeBaseService.updateSysCode(sysCode).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //删除码表信息
  def delSysCode(request: SysCodeDeleteReq): Future[Boolean] = {
    try {
      sysCodeBaseService.delSysCode(request.typeId, request.value).map {
        rst => true
      }
    } catch {
      case _: Exception => Future(false)
    }
  }

  //校验一条系统码表编号唯一性
  def validSysCode(request: SysCodeValidReq): Future[Boolean] = {
    sysCodeBaseService.getSysCodeById(request.typeId, request.value).map {
      case Some(item) => false
      case None => true
    }
  }

  //获取一条码表信息
  def getSysCode(request: SysCodeReq): Future[SysCodeOneResp] = {
    sysCodeBaseService.getSysCodeById(request.typeId, request.value).map {
      case Some(sysCode) => SysCodeOneResp("success", "", Some(SysCodeInfo(sysCode.value, sysCode.display, sysCode.typeId, sysCode.typeName,
        sysCode.sortNo, sysCode.description)))
      case None => SysCodeOneResp("failed", "not exist!", None) //不存在返回失败
    }
  }

  //获取某一类型下的所有数据
  def getSysCodesByType(request: SysCodeByTypeReq): Future[SysCodeOneTypeResp] = {
    sysCodeBaseService.getByTypeId(request.typeId).map {
      sysCodes => SysCodeOneTypeResp("0", SysCodesInfo(SysCodeRow(sysCodes.map {
        sysCode => SysCodeItem(sysCode.value, sysCode.display)
      })))
    }
  }

  //分页码表数据获取
  def getSysCodes(request: SysCodesReq): Future[SysCodesListResp] = {
    sysCodeBaseService.collSysCodePageList(request.typeId.getOrElse(""),
      request.pageSize, (request.pageNumber - 1) * request.pageSize).map {
      sysCodePage =>  SysCodesListResp("0", SysCodeData(SysTypeList(request.pageNumber,  sysCodePage._2, request.pageSize,  sysCodePage._1.map {
        sysCode =>  SysCodeInfo(sysCode.value,sysCode.display,sysCode.typeId,sysCode.typeName,sysCode.sortNo,sysCode.description)
      })))
    }
  }

  //码表翻译
  def getDisplay(value:String,typeId:String): Future[String] ={
    sysCodeBaseService.getSysCodeById(typeId,value).map{
      case Some(sysCode) => sysCode.display
      case None => ""
    }
  }

}