package com.wisedu.next.admin.domains

//标签操作返回值
case class TagOpResp(status: String, errorMsg: String)

case class TagInfo(tagId: String, tagName: String,
                   tagType: String, tagLevel: String,
                   enabled: String,tagDomain: String,
                   description: String, extendInfo: String,
                   isShown: String, createTime: String,
                   createUser: String, updateTime: String
                   )

//获取一条标签
case class TagResp(status: String, errorMsg: String,datas:Option[TagInfo])

//获取标签列表
case class TagItem(tagId:String,tagName:String,tagType:String,tagLevel:String,contentNum:String,enabled:String,isShown:String,createTime:String,createUser:String,updateTime:String)
case class TagList(pageNumber:Int,totalSize:Int,pageSize:Int,rows:Seq[TagItem])
case class TagData(tagList:TagList)
case class TagListResp(code: String,datas:TagData)


//获取所有的标签 (选择的时候用)
case class TagCodeItem(id:String,name:String)
case class TagCodeRow(rows:Seq[TagCodeItem])
case class TagCodesInfo(code:TagCodeRow)
case class TagCodesResp(code: String,datas:TagCodesInfo)