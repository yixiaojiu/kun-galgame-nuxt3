import MessageModel from '~/server/models/message'

export default defineEventHandler(async (event) => {
  const userInfo = getCookieTokenInfo(event)
  if (!userInfo) {
    kunError(event, 10115, 205)
    return
  }
  const uid = userInfo.uid

  const { mid }: { mid: string } = await getQuery(event)
  if (!mid) {
    kunError(event, 10507)
    return
  }

  await MessageModel.updateOne({ receiver_uid: uid, mid }, { status: 'read' })

  return 'MOEMOE read message successfully!'
})
