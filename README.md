# yari-gists-indexer
Creates a gist index based on a title pattern and save it into a gist

## Usage
    $ cd yari-gists-indexer
    $ npm install
    $ node app ariok [auth_token] [dest_gist_id]

## Example
    ⚡ node app ariok cbc68457bf406a1042b345d4b2555e520fee029c 7908416
     > Fetching gists for user "ariok"...
     > Gists fetched successfully
     > Compiling gist...
     > Saving gist...
     > Gist file saved at https://gist.github.com/ariok/7908416

## Templating
The output is based on `./etc/index.md.tpl` an [handlebar](http://handlebarsjs.com/) template file.