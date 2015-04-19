require 'require_all'

require_all 'Extension'
require_all 'Manager'
require_all 'Model'
require_all 'Network'
require_relative 'game'

require 'json'
require 'socket'
require 'thread'

MAX_PLAYER_NUMBER_PER_GAME = 5
ENGLISH_WORD_LIST_FILE = Dir.pwd + '/Resources/en.txt'

class FingerPop

  @@session_count = 0

  #
  def initialize
    @game_list = []

    @message_handler = MessageHandler.instance
    @word_list_manager = WordListManager.instance.load_word_list ENGLISH_WORD_LIST_FILE

    # Add self to message handler to listen for the new session message
    @message_handler.add_observer self
  end

  # This is the main procedure of the system. It will loop to get new session request.
  # It will create a game instance, put players in it and start the game once the
  # the game is full.
  def run
    # Start the message handler
    @message_handler.start
  end

  def update command

    # For session start command, we need to create a new game instance.
    if command.is_a? SessionStartCommand
      current_waiting_game = @game_list.last
      if current_waiting_game.nil? or
          current_waiting_game.player_count >= MAX_PLAYER_NUMBER_PER_GAME
        current_waiting_game = Game.new next_session_id
        @game_list << current_waiting_game
      end

      current_waiting_game.process_command command
    else
      # otherwise, simply find the game instance by the session id.
      index = @game_list.index { |x| x.session_id == command.session_id }

      # Send the command to the game
      @game_list[index].process_command command unless index.nil?
    end

  end


  def next_session_id
    new_id = @@session_count
    @@session_count = new_id + 1
    new_id
  end

end

finger_pop = FingerPop.new
finger_pop.run