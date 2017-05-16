require 'webrick'

server = WEBrick::HTTPServer.new(:Port => 9090, :DocumentRoot => Dir.pwd)

trap('INT') { server.shutdown }

server.start
