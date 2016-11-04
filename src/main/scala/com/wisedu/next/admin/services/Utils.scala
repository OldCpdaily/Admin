package com.wisedu.next.admin.services

import java.util.{Date, Random, UUID}
import javax.inject.Singleton

/**
  * Created by zhou on 2016/4/15.
  */
@Singleton
class Utils {
  def getRandomString(len: Int, name: String): String = {
    val suffix = name.substring(name.lastIndexOf("."))
    val random = new Random()
    var idx = 0
    val str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    var rst = new Date().getTime.toString
    while (idx < len) {
      val num = random.nextInt(62)
      rst = rst + str(num)
      idx = idx + 1
    }
    rst + suffix
  }

  def getIdFromName(name: String) : String = {
    val idx = name.lastIndexOf(".")
    val suffix = name.substring(idx)
    val n = name.substring(0, idx)
    val nId = UUID.nameUUIDFromBytes(n.getBytes("UTF-8")).toString + suffix
    nId
  }
}
