require 'require_all'

require_all 'Extension'
require_all 'Manager'
require_all 'Model'
require_all 'Network'
require_relative 'game'

require 'json'
require 'socket'
require 'thread'

MAX_PLAYER_NUMBER_PER_GAME = 3
ENGLISH_WORD_LIST_FILE = Dir.pwd + '/Resources/en1.txt'
MINIMUM_LENGTH_OF_WORD = 3
MAXIMUM_LENGTH_OF_WORD = 10
NUMBER_OF_WORKERS = 4

class FingerPop
  #
  def initialize
    @game_list = []
    # @worker_list = []

    @message_handler = MessageHandler.instance

    @command_factory = CommandFactory.new

    # NUMBER_OF_WORKERS.times do
    #   command_factory = CommandFactory.new
    #   worker = MessageProcessor.new(@message_handler.received_message_queue, command_factory, @game_list)
    #   @worker_list << Thread.new { worker.run }
    # end

    @processor = MessageProcessor.new(@message_handler.received_message_queue, @command_factory, @game_list)

  end

  # This is the main procedure of the system. It will loop to get new session request.
  # It will create a game instance, put players in it and start the game once the
  # the game is full.
  def run
    # Start the message handler
    @message_handler.start

    @processor.run
  end
end

finger_pop = FingerPop.new
finger_pop.run