var readFileSync = require('fs').readFileSync,
    get = require('request').defaults({ json: true }).get,
    Handlebars = require('handlebars'),
    getFilteredGists = require('./lib/get_filtered_gists'),
    updateGist = require('./lib/update_gist')

var gistId = process.argv.pop()
var authToken = process.argv.pop()
var userId = process.argv.pop()

var filter = /^\[(.+)\]/
var tpl = Handlebars.compile(readFileSync('./etc/index.md.tpl', 'utf8'))

console.log(' > Fetching gists for user "' + userId + '"...')

getFilteredGists(userId, authToken, filter, function (err, gists) {
  if (!err) console.log(' > Gists fetched successfully (' + gists.length + ')')
  else return console.error(' ! Something went wrong: ', err)

  var categories = {}

  gists.forEach(function (gist) {
    gist.description = gist.description || Object.keys(gist.files)[0]
    gist.description = gist.description.replace(/(\r\n)+/g, ' ')

    var reducedGist = {
      filenames: Object.keys(gist.files),
      description: gist.description,
      id: gist.id
    }

    Object.keys(gist.files).forEach(function (filename) {
      var match = filename.match(filter)
      if (!match) return
      var category = match[1]
      if (undefined === categories[category]) {
        categories[category] = [reducedGist]
      } else {
        categories[category].push(reducedGist)
      }
    })
  })

  var categoriesSorted = {}
  Object.keys(categories).sort().forEach(function (category) {
    categoriesSorted[category] = categories[category]
  })

  console.log(' > Compiling gist...')

  var gistContent = tpl({
    user: userId,
    updatedAt: new Date(),
    gists: categoriesSorted
  })

  console.log(' > Saving gist...')

  updateGist(userId, authToken, gistId, gistContent, function (err, res) {
    if (!err) console.log(' > Gist file saved at https://gist.github.com/' + userId + '/' + gistId)
    else console.error(' ! Something went wrong: ', err)
  })
})