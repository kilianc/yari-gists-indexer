var readFileSync = require('fs').readFileSync,
    get = require('request').defaults({ json: true }).get,
    Handlebars = require('handlebars'),
    getFilteredGists = require('./lib/get_filtered_gists'),
    updateGist = require('./lib/update_gist')

var userId = 'ariok'
var authToken = 'cbc68457bf406a1042b870d4b2777e520fee029c'
var gistId = '7908416'
var filter = /^\[.+\]/
var tpl = Handlebars.compile(readFileSync('./etc/index.md.tpl', 'utf8'))

getFilteredGists(userId, filter, function (err, gists) {
  gists = gists.map(function (gist) {
    return {
      filenames: Object.keys(gist.files),
      description: gist.description || Object.keys(gist.files)[0],
      id: gist.id
    }
  })

  var gistContent = tpl({
    user: userId,
    author: 'Yari',
    email: 'info@yari.com',
    updatedAt: new Date(),
    gists: gists
  })

  console.log(gistContent)

  updateGist('kilianc', authToken, gistId, gistContent, function (err, res) {
    console.log(err, res)
  })
})