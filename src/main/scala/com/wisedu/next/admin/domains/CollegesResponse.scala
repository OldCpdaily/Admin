package com.wisedu.next.admin.domains

//校园分类Response 选择的时候用
case class CollegeCodeItem(id: String, name: String)
case class CollegeRow(rows: Seq[CollegeCodeItem])
case class CollegeCode(code: CollegeRow)
case class CollegeCodesResp(code: String, datas: CollegeCode)

//学校操作返回值
case class CollegeOpResp(status: String, errorMsg: String)

//学校信息
case class CollegeInfo( collegeId: String,name: String,
                        eName: String, shortName: String,
                        imgUrl: String, lat: String,
                        lng: String, addr: String,
                        region: String)

//获取一个学校
case class CollegeResp(status: String, errorMsg: String,datas:Option[CollegeInfo])


//获取学校列表
case class CollegeItem(collegeId:String,name:String,eName:String,shortName:String,imgUrl:String,lat:String,lng:String,addr:String,region:String)
case class CollegeList(pageNumber:Int,totalSize:Int,pageSize:Int,rows:Seq[CollegeItem])
case class CollegeData(CollegeList:CollegeList)
case class CollegeListResp(code: String,datas:CollegeData)



