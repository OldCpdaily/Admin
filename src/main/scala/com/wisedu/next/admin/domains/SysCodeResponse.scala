package com.wisedu.next.admin.domains

case class SysCodeOpResp(status: String, errorMsg: String)


case class SysCodeInfo(value:String,display:String,typeId:String,typeName:String,sortNum:Int,description:String)

//获取一条系统码表数据
case class SysCodeOneResp(status: String, errorMsg: String,datas:Option[SysCodeInfo])


//获取某一类型下的所有数据
case class SysCodeItem(id:String,name:String)
case class SysCodeRow(rows:Seq[SysCodeItem])
case class SysCodesInfo(code:SysCodeRow)
case class SysCodeOneTypeResp(code: String,datas:SysCodesInfo)


//获取系统码表数据列表
case class SysTypeList(pageNumber:Int,totalSize:Int,pageSize:Int,rows:Seq[SysCodeInfo])
case class SysCodeData(sysTypeList:SysTypeList)
case class SysCodesListResp(code: String,datas:SysCodeData)