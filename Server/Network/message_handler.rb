require "observer"
require 'singleton'

SERVER_DEFAULT_ADDR = "/tmp/server"
SERVER_PORT = 9999
MAX_MESSAGE_LENGTH = 512

class MessageHandler
  attr_reader :received_message_queue
  include Observable
  include Singleton

  def initialize
    @serv = UNIXServer.new SERVER_DEFAULT_ADDR

    @received_message_queue = Queue.new
    @to_send_message_queue = Queue.new
  end

  def start
    get_new_socket_manager

    @receive_thread = Thread.new {
      loop do
        receive_message
      end
    }

    @send_thread = Thread.new {
      loop do
        send_message
      end
    }
  end

  def get_new_socket_manager
    puts 'Waiting for socket manager connection' if (@socket_manager = @serv.accept).nil?
    puts "Socket manager from #{ @socket_manager.peeraddr }"
  end

  def send_result result
    @to_send_message_queue << result
  end

  private

  def send_message
    begin
      new_result = @to_send_message_queue.pop

      @socket_manager.sendmsg_nonblock new_result, 0
    rescue
      @socket_manager.close unless @socket_manager.nil? or @socket_manager.closed?
    end
  end

  def stop
    puts 'killing threads...'
    @receive_thread.kill
    @send_thread.kill
  end

  def receive_message
    begin
      new_message = @socket_manager.recv MAX_MESSAGE_LENGTH

      # Keep receiving message from the socket.
      @received_message_queue << new_message

    rescue
      # Close the socket manager if anything bad happen
      @socket_manager.close unless @socket_manager.nil? or @socket_manager.closed?
    end
  end

end