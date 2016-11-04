package com.wisedu.next.admin.domains

//虚拟组操作返回值
case class GroupOpResp(status: String, errorMsg: String)

case class GroupInfo(groupId: String, groupName: String,
                     groupType: String, contentTypeLimit: String,
                     tagLimit: String, permissionsLimit: String,
                     schoolLimit: String, description: String,
                     sortNum: String, groupParam: String,
                     logo: String, backgroundImg: String,
                     startTime: String, endTime: String,
                     aggregationGroup: String, strutsType: String,
                     posterGroupId:String,isAnonymous:String)

//获取一条虚拟组
case class GroupResp(status: String, errorMsg: String, datas: Option[GroupInfo])

//获取虚拟组列表
case class GroupItem(groupId: String, groupName: String, groupType: String, contentTypeLimit: String, tagLimit: String,
                     permissionsLimit: String, aggregationGroup: String, startTime: String, endTime: String,
                     sortNum: String,strutsType:String,description: String)

case class GroupList(pageNumber: Int, totalSize: Int, pageSize: Int, rows: Seq[GroupItem])

case class GroupData(groupList: GroupList)

case class GroupListResp(code: String, datas: GroupData)

//获取频道列表
case class ChannelItem(id: String, groupName: String, groupType: String, contentTypeLimit: String, tagLimit: String)

case class ChannelList(pageNumber: Int, totalSize: Int, pageSize: Int, rows: Seq[ChannelItem])

case class ChannelData(groupList: ChannelList)

case class ChannelListResp(code: String, datas: GroupData)


//获取所有的虚拟组 (选择的时候用)
case class GroupCodeItem(id: String, name: String)

case class GroupCodeRow(rows: Seq[GroupCodeItem])

case class GroupCodesInfo(code: GroupCodeRow)

case class GroupCodesResp(code: String, datas: GroupCodesInfo)

//获取所有的直播信息
case class GroupLiveItem(feedId:String,title:String,cTime:String,mTime:String,
                         readNum:String,updateNum:String,likeNum:String,mediaName:String,
                         mediaImgUrl:String,summ:String,summImgNum:String,onlineUserNum:String,
                         liveStatus:String,liveStartTime:String,srcUrl:String,videoLength:String,contUrl:String,imgUrl:String)
case class GroupLiveResp(feeds: Seq[GroupLiveItem])
