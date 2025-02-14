import UserModel from '~/server/models/user'
import ReplyModel from '~/server/models/reply'
import mongoose from 'mongoose'
import type { TopicDislikeReplyRequestData } from '~/types/api/reply'

const updateReplyDislike = async (
  uid: number,
  to_uid: number,
  rid: number,
  isPush: boolean
) => {
  if (uid === to_uid) {
    return
  }

  const reply = await ReplyModel.findOne({ rid })
  if (!reply) {
    return 10506
  }

  const isDislikedReply = reply.dislikes.includes(uid)
  if (isDislikedReply && isPush) {
    return 10510
  }

  const amount = isPush ? 1 : -1

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    await ReplyModel.updateOne(
      { rid: rid },
      { [isPush ? '$push' : '$pull']: { dislikes: uid } }
    )

    await UserModel.updateOne({ uid: to_uid }, { $inc: { dislike: amount } })

    await session.commitTransaction()
    session.endSession()
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
  }
}

export default defineEventHandler(async (event) => {
  const userInfo = getCookieTokenInfo(event)
  if (!userInfo) {
    kunError(event, 10115, 205)
    return
  }
  const uid = userInfo.uid

  const { to_uid, rid, isPush }: TopicDislikeReplyRequestData =
    await getQuery(event)
  if (!to_uid || !isPush) {
    kunError(event, 10507)
    return
  }

  if (uid.toString() === to_uid) {
    return
  }

  const result = await updateReplyDislike(
    uid,
    parseInt(to_uid),
    parseInt(rid),
    isPush === 'true'
  )
  if (typeof result === 'number') {
    kunError(event, result)
    return
  }

  return 'MOEMOE dislike reply operation successfully!'
})
