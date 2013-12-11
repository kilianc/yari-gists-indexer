var get = require('request').defaults({ json: true }).get

module.exports = function getFilteredGists(gistUser, filter, callback) {
  get({
    uri: 'https://api.github.com/users/' + gistUser + '/gists',
    headers: { 'User-Agent': 'Gist Indexer' }
  }, function (err, res, gists) {
    if (err) return callback ? callback(err) : null

    callback(null, gists.filter(function (gist, i) {
      return Object.keys(gist.files).some(function (filename) {
        return filename.match(filter)
      })
    }))
  })
}