var readFileSync = require('fs').readFileSync,
    get = require('request').defaults({ json: true }).get,
    Handlebars = require('handlebars'),
    getFilteredGists = require('./lib/get_filtered_gists'),
    updateGist = require('./lib/update_gist')

var gistId = process.argv.pop()
var authToken = process.argv.pop()
var userId = process.argv.pop()

var filter = /^\[.+\]/
var tpl = Handlebars.compile(readFileSync('./etc/index.md.tpl', 'utf8'))

console.log(' > Fetching gists for user "' + userId + '"...')

getFilteredGists(userId, filter, function (err, gists) {
  if (!err) console.log(' > Gists fetched successfully (' + gists.length + ')')
  else return console.error(' ! Something went wrong: ', err)

  gists = gists.map(function (gist) {
    return {
      filenames: Object.keys(gist.files),
      description: gist.description || Object.keys(gist.files)[0],
      id: gist.id
    }
  })

  console.log(' > Compiling gist...')

  var gistContent = tpl({
    user: userId,
    updatedAt: new Date(),
    gists: gists
  })

  console.log(' > Saving gist...')

  updateGist(userId, authToken, gistId, gistContent, function (err, res) {
    if (!err) console.log(' > Gist file saved at https://gist.github.com/' + userId + '/' + gistId)
    else console.error(' ! Something went wrong: ', err)
  })
})