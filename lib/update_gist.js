var patch = require('request').defaults({ json: true }).patch

module.exports = function updateGist(userId, authToken, gistId, content, callback) {
  patch({
    uri: 'https://api.github.com/gists/' + gistId,
    headers: { 'User-Agent': 'Gist Indexer' },
    auth: { user: userId, pass: authToken },
    body: { 'files': { 'INDEX.md': { 'content' : content } } }
  }, function (err, res, body) {
    if (!err && res.statusCode !== 200) err = new Error(body.message)
    callback && callback(err, body)
  })
}