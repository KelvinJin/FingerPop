require 'socket'

SERVER_DEFAULT_ADDR = "/tmp/server"
MAX_MESSAGE_LENGTH = 512

server = UNIXSocket.new SERVER_DEFAULT_ADDR

receive_thread = Thread.new {
  loop do
    new_message = server.recv MAX_MESSAGE_LENGTH

    puts "Received new message: #{ new_message }"
  end
}

loop do
  message = gets.chomp

  directives = message.split ' '

  command_message = nil

  case directives[0].to_i
    when 0
      command_message = '{"Type":0, "Content":{"@ip_addr":"127.0.0.1"}}'
    when 2

    when 3
      command_message = "{\"Type\":3,\"Content\":{\"@session_id\":#{ directives[1] },\"@player_id\":\"#{ directives[2] }\",\"@card_letter\":\"#{ directives[3] }\",\"@slot_id\":#{ directives[4].to_i }}}"
  else
    next
  end


  server << command_message

  if message == '\q'
    receive_thread.kill
    break
  end
end