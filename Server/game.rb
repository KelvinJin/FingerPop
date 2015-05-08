require 'observer'

class Game

  attr_reader :session_id

  include Observable
  # Every game is a process. A game will contain limited number of players.
  # A new score board, new state manager and new decision maker will be created
  # for this game instance.



  def initialize session_id
    @session_id = session_id

    # The command will be passed to the game instance first
    # and the game instance should notify the decision manager.
    @decision_manager = DecisionManager.new

    # After the decision manager filter the commands,
    # other managers should continue to process the command respectively.
    @player_manager = PlayerManager.new
    @score_board_manager = ScoreBoardManager.new
    @word_manager = WordManager.new

    @state_manager = StateManager.new @player_manager, @score_board_manager, @word_manager

  end

  def player_count
    @player_manager.player_count
  end

  def process_command command

    # Ask decision manager to process the command
    processed_command = @decision_manager.process_command command

    return if processed_command.nil?

    command_result = nil

    if processed_command.is_a? SessionStartCommand
      puts 'Adding a new player...'

      # Add new player to player pool
      new_player = @player_manager.add_player processed_command.ip_addr

      # Add new player to score board
      @score_board_manager.add_player new_player

      need_to_start = @player_manager.player_count >= MAX_PLAYER_NUMBER_PER_GAME
      new_word = need_to_start ? @word_manager.current_unsorted_word : nil

      command_result = SessionStartCommandResult.new @session_id,
                                                     new_player.player_id,
                                                     new_player.name, new_word



      puts 'done.'
    end

    if processed_command.is_a? SessionEndCommand
      puts 'Removing a player'

      # Remove the player from player pool
      deleted_player = @player_manager.remove_player processed_command.player_id

      # Remove the player from score board
      @score_board_manager.remove_player deleted_player

      puts 'done.'
    end

    if processed_command.is_a? LetterInsertCommand
      puts 'Inserting a new letter...'

      command_result = @word_manager.insert_letter processed_command.card_letter

      if (score_dif = command_result.score_dif) != 0
        player = @player_manager.find processed_command.player_id

        @score_board_manager.update_score player, score_dif
      end

      command_result.session_id = processed_command.session_id
      command_result.player_id = processed_command.player_id

      puts 'done.'
    end

    @state_manager.tick

    # puts "CURRENT STATE: #{ @state_manager.to_s }"

    puts command_result.to_json

    MessageHandler.instance.send_result JSON.generate command_result.to_json unless command_result.nil?
  end

end