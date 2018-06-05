const replicators = require('./core/replicators')

class Queue {
  constructor (telegram, interval) {
    this.telegram = telegram
    this.interval = interval
    this.queue = []
    this.interval_id = setInterval(this._processQueue.bind(this), interval)
    return this;
  }

  _processQueue () {
    if(this.queue.length !== 0){
      let request = this.queue.shift()
      this.telegram.callApi(request.method, request.params)
      .then(request.resolve)
      .catch(request.reject)
    }
  }

  enqueue (method, params) {
    return new Promise((resolve, reject) => {
      this.queue.push({method, params, resolve, reject});
    });
  }

  stop () {
    clearInterval(this.interval_id)
  }

  start (interval) {
    if(interval)
      this.interval = interval
    
    this.interval_id = setInterval(this._processQueue.bind(this), this.interval)
  }

  getMe () {
    return this.enqueue('getMe')
  }

  getFile (fileId) {
    return this.enqueue('getFile', {file_id: fileId})
  }

  getWebhookInfo () {
    return this.enqueue(`getWebhookInfo`)
  }

  getGameHighScores (userId, inlineMessageId, chatId, messageId) {
    return this.enqueue(`getGameHighScores`, {
      user_id: userId,
      inline_message_id: inlineMessageId,
      chat_id: chatId,
      message_id: messageId
    })
  }

  setGameScore (userId, score, inlineMessageId, chatId, messageId, editMessage = true, force) {
    return this.enqueue(`setGameScore`, {
      user_id: userId,
      score: score,
      inline_message_id: inlineMessageId,
      chat_id: chatId,
      message_id: messageId,
      disable_edit_message: !editMessage,
      force: force
    })
  }

  sendMessage (chatId, text, extra) {
    return this.enqueue('sendMessage', Object.assign({ chat_id: chatId, text: text }, extra))
  }

  forwardMessage (chatId, fromChatId, messageId, extra) {
    return this.enqueue('forwardMessage', Object.assign({
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId
    }, extra))
  }

  sendChatAction (chatId, action) {
    return this.enqueue('sendChatAction', { chat_id: chatId, action: action })
  }

  getUserProfilePhotos (userId, offset, limit) {
    return this.enqueue('getUserProfilePhotos', { user_id: userId, offset: offset, limit: limit })
  }

  sendLocation (chatId, latitude, longitude, extra) {
    return this.enqueue('sendLocation', Object.assign({ chat_id: chatId, latitude: latitude, longitude: longitude }, extra))
  }

  sendVenue (chatId, latitude, longitude, title, address, extra) {
    return this.enqueue('sendVenue', Object.assign({
      chat_id: chatId,
      latitude: latitude,
      longitude: longitude,
      title: title,
      address: address
    }, extra))
  }

  sendInvoice (chatId, invoice, extra) {
    return this.enqueue('sendInvoice', Object.assign({ chat_id: chatId }, invoice, extra))
  }

  sendContact (chatId, phoneNumber, firstName, extra) {
    return this.enqueue('sendContact', Object.assign({ chat_id: chatId, phone_number: phoneNumber, first_name: firstName }, extra))
  }

  sendPhoto (chatId, photo, extra) {
    return this.enqueue('sendPhoto', Object.assign({ chat_id: chatId, photo: photo }, extra))
  }

  sendDocument (chatId, doc, extra) {
    return this.enqueue('sendDocument', Object.assign({ chat_id: chatId, document: doc }, extra))
  }

  sendAudio (chatId, audio, extra) {
    return this.enqueue('sendAudio', Object.assign({ chat_id: chatId, audio: audio }, extra))
  }

  sendSticker (chatId, sticker, extra) {
    return this.enqueue('sendSticker', Object.assign({ chat_id: chatId, sticker: sticker }, extra))
  }

  sendVideo (chatId, video, extra) {
    return this.enqueue('sendVideo', Object.assign({ chat_id: chatId, video: video }, extra))
  }

  sendVideoNote (chatId, videoNote, extra) {
    return this.enqueue('sendVideoNote', Object.assign({ chat_id: chatId, video_note: videoNote }, extra))
  }

  sendVoice (chatId, voice, extra) {
    return this.enqueue('sendVoice', Object.assign({ chat_id: chatId, voice: voice }, extra))
  }

  sendGame (chatId, gameName, extra) {
    return this.enqueue('sendGame', Object.assign({ chat_id: chatId, game_short_name: gameName }, extra))
  }

  sendMediaGroup (chatId, media, extra) {
    return this.enqueue('sendMediaGroup', Object.assign({ chat_id: chatId, media }, extra))
  }

  getChat (chatId) {
    return this.enqueue('getChat', {chat_id: chatId})
  }

  getChatAdministrators (chatId) {
    return this.enqueue('getChatAdministrators', {chat_id: chatId})
  }

  getChatMember (chatId, userId) {
    return this.enqueue('getChatMember', { chat_id: chatId, user_id: userId })
  }

  getChatMembersCount (chatId) {
    return this.enqueue('getChatMembersCount', {chat_id: chatId})
  }

  answerInlineQuery (inlineQueryId, results, extra) {
    return this.enqueue('answerInlineQuery', Object.assign({ inline_query_id: inlineQueryId, results: JSON.stringify(results) }, extra))
  }

  kickChatMember (chatId, userId, untilDate) {
    return this.enqueue('kickChatMember', { chat_id: chatId, user_id: userId, until_date: untilDate })
  }

  promoteChatMember (chatId, userId, extra) {
    return this.enqueue('promoteChatMember', Object.assign({ chat_id: chatId, user_id: userId }, extra))
  }

  restrictChatMember (chatId, userId, extra) {
    return this.enqueue('restrictChatMember', Object.assign({ chat_id: chatId, user_id: userId }, extra))
  }

  exportChatInviteLink (chatId) {
    return this.enqueue('exportChatInviteLink', { chat_id: chatId })
  }

  setChatPhoto (chatId, photo) {
    return this.enqueue('setChatPhoto', { chat_id: chatId, photo: photo })
  }

  deleteChatPhoto (chatId) {
    return this.enqueue('deleteChatPhoto', { chat_id: chatId })
  }

  setChatTitle (chatId, title) {
    return this.enqueue('setChatTitle', { chat_id: chatId, title: title })
  }

  setChatDescription (chatId, description) {
    return this.enqueue('setChatDescription', { chat_id: chatId, description: description })
  }

  pinChatMessage (chatId, messageId, extra) {
    return this.enqueue('pinChatMessage', Object.assign({ chat_id: chatId, message_id: messageId }, extra))
  }

  unpinChatMessage (chatId) {
    return this.enqueue('unpinChatMessage', { chat_id: chatId })
  }

  leaveChat (chatId) {
    return this.enqueue('leaveChat', {chat_id: chatId})
  }

  unbanChatMember (chatId, userId) {
    return this.enqueue('unbanChatMember', { chat_id: chatId, user_id: userId })
  }

  answerCallbackQuery (callbackQueryId, text, url, showAlert, cacheTime) {
    return this.enqueue('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text: text,
      url: url,
      show_alert: showAlert,
      cache_time: cacheTime
    })
  }

  answerCbQuery (callbackQueryId, text, showAlert, extra) {
    return this.enqueue('answerCallbackQuery', Object.assign({
      callback_query_id: callbackQueryId,
      text: text,
      show_alert: showAlert
    }, extra))
  }

  answerGameQuery (callbackQueryId, url) {
    return this.enqueue('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      url: url
    })
  }

  answerShippingQuery (shippingQueryId, ok, shippingOptions, errorMessage) {
    return this.enqueue('answerShippingQuery', {
      shipping_query_id: shippingQueryId,
      ok: ok,
      shipping_options: shippingOptions,
      error_message: errorMessage
    })
  }

  answerPreCheckoutQuery (preCheckoutQueryId, ok, errorMessage) {
    return this.enqueue('answerPreCheckoutQuery', {
      pre_checkout_query_id: preCheckoutQueryId,
      ok: ok,
      error_message: errorMessage
    })
  }

  editMessageText (chatId, messageId, inlineMessageId, text, extra) {
    return this.enqueue('editMessageText', Object.assign({
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      text: text
    }, extra))
  }

  editMessageCaption (chatId, messageId, inlineMessageId, caption, extra) {
    return this.enqueue('editMessageCaption', {
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      caption: caption,
      parse_mode: extra.parse_mode,
      reply_markup: extra.parse_mode || extra.reply_markup ? extra.reply_markup : extra
    })
  }

  editMessageReplyMarkup (chatId, messageId, inlineMessageId, markup) {
    return this.enqueue('editMessageReplyMarkup', {
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      reply_markup: markup
    })
  }

  editMessageLiveLocation (latitude, longitude, chatId, messageId, inlineMessageId, markup) {
    return this.enqueue('editMessageLiveLocation', {
      latitude,
      longitude,
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      reply_markup: markup
    })
  }

  stopMessageLiveLocation (chatId, messageId, inlineMessageId, markup) {
    return this.enqueue('stopMessageLiveLocation', {
      chat_id: chatId,
      message_id: messageId,
      inline_message_id: inlineMessageId,
      reply_markup: markup
    })
  }

  deleteMessage (chatId, messageId) {
    return this.enqueue('deleteMessage', {
      chat_id: chatId,
      message_id: messageId
    })
  }

  setChatStickerSet (chatId, setName) {
    return this.enqueue('setChatStickerSet', {
      chat_id: chatId,
      sticker_set_name: setName
    })
  }

  deleteChatStickerSet (chatId) {
    return this.enqueue('deleteChatStickerSet', { chat_id: chatId })
  }

  getStickerSet (setName) {
    return this.enqueue('getStickerSet', { name: setName })
  }

  uploadStickerFile (ownerId, stickerFile) {
    return this.enqueue('uploadStickerFile', {
      user_id: ownerId,
      png_sticker: stickerFile
    })
  }

  createNewStickerSet (ownerId, name, title, stickerData) {
    return this.enqueue('createNewStickerSet', Object.assign({
      user_id: ownerId,
      name: name,
      title: title
    }, stickerData))
  }

  addStickerToSet (ownerId, name, stickerData, isMasks) {
    return this.enqueue('addStickerToSet', Object.assign({
      user_id: ownerId,
      name: name,
      is_masks: isMasks
    }, stickerData))
  }

  setStickerPositionInSet (sticker, position) {
    return this.enqueue('setStickerPositionInSet', {
      sticker: sticker,
      position: position
    })
  }

  deleteStickerFromSet (sticker) {
    return this.enqueue('deleteStickerFromSet', { sticker: sticker })
  }

  sendCopy (chatId, message, extra) {
    if (!message) {
      throw new Error('Message is required')
    }
    const type = Object.keys(replicators.copyMethods).find((type) => message[type])
    if (!type) {
      throw new Error('Unsupported message type')
    }
    const opts = Object.assign({chat_id: chatId}, replicators[type](message), extra)
    return this.enqueue(replicators.copyMethods[type], opts)
  }

}

module.exports = Queue