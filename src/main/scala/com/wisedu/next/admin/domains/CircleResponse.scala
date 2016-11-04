package com.wisedu.next.admin.domains

//虚拟组操作返回值
case class CircleOpResp(status: String, errorMsg: String)

case class CircleInfo( circleId: String,  circleName: String,
                       description: String,  circleType: String,
                       strutsType: String,  sortNum: String,
                       schoolLimit: String,  permissionsLimit: String,
                       logo: String,limits:String,
                       backgroundImg: String,  sortStrategy: String,
                       posterGroupId: String,  topMessages: String,
                       isAnonymous: String,  isRealNamePost: String,
                       isRealNameRespond: String,notice:String,
                       adminUser: String)

//获取一条虚拟组
case class CircleResp(status: String, errorMsg: String, datas: Option[CircleInfo])

//获取虚拟组列表
case class CircleItem( circleId: String,  circleName: String,
                       description: String,  circleType: String,
                       strutsType: String,  sortNum: String,
                       schoolLimit: String,
                       logo: String,
                       backgroundImg: String,  sortStrategy: String,
                       posterGroupId: String,  topMessages: String,
                       isAnonymous: String,  isRealNamePost: String,
                       isRealNameRespond: String)

case class CircleList(pageNumber: Int, totalSize: Int, pageSize: Int, rows: Seq[CircleItem])

case class CircleData(circleList: CircleList)

case class CircleListResp(code: String, datas: CircleData)

