package com.wisedu.next.admin.domains

case class MediaOpResp(status: String, errorMsg: String)

case class MediaInfo(campusMediaId: String, campusMediaName: String,
                     sourceType: String, source: String,
                     organizationType: String, description: String,
                     campusMediaLogo: String, backgroundImg: String,
                     collegeId: String,sortNum:String,isDisplay:String)

//获取一条媒体号
case class MediaResp(status: String, errorMsg: String, datas: Option[MediaInfo])

//获取媒体号列表
case class MediaItem(campusMediaId: String, campusMediaLogo: String, campusMediaName: String,
                     source: String, sourceType: String, organizationType: String, lastUpdateTime: String,
                     crawlerState: String,college:String)

case class MediaList(pageNumber: Int, totalSize: Int, pageSize: Int, rows: Seq[MediaItem])

case class MediaData(campusMediaList: MediaList)

case class MediaListResp(code: String, datas: MediaData)


//获取所有的校园号 (选择的时候用)
case class MediaCodeItem(id: String, name: String)

case class MediaCodeRow(rows: Seq[MediaCodeItem])

case class MediaCodesInfo(code: MediaCodeRow)

case class MediaCodesResp(code: String, datas: MediaCodesInfo)