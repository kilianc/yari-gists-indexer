var get = require('request').defaults({ json: true }).get

module.exports = function getFilteredGists(userId, authToken, filter, callback) {
  get({
    uri: 'https://api.github.com/' + userId + '/gists',
    headers: { 'User-Agent': 'Gist Indexer' },
    auth: { user: userId, pass: authToken },
  }, function (err, res, body) {
    if (!err && res.statusCode !== 200) err = new Error(body.message)
    if (err) return callback ? callback(err) : null

    callback(null, body.filter(function (gist, i) {
      return Object.keys(gist.files).some(function (filename) {
        return filename.match(filter)
      })
    }))
  })
}