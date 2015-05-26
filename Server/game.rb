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
    @token_manager = TokenManager.new

    @token_manager.add_observer self

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
      @player_manager.add_player processed_command.player_id, processed_command.player_name

      need_to_start = @player_manager.player_count >= MAX_PLAYER_NUMBER_PER_GAME

      if need_to_start
        puts "New game is starting...#{ @player_manager.to_json.inspect }"

        command_result = SessionStartCommandResult.new @session_id, @player_manager.to_json, 'hello'
      end

      puts 'done.'
    end

    if processed_command.is_a? TokenRequestCommand

      puts 'Token request...'

      # Find the player
      player = @player_manager.find processed_command.player_id

      @token_manager.request(player, processed_command.signature) unless player.nil?

      puts 'done.'
    end

    if processed_command.is_a? LetterInsertCommand
      puts 'State update message...'

      # Check token
      if @token_manager.verify processed_command.token

        # Broadcast the update if token is valid.
        command_result = LetterInsertCommandResult.new processed_command.session_id,
                                                       processed_command.player_id,
                                                       processed_command.message

      end

      puts 'done.'
    end

    if processed_command.is_a? TokenReleaseCommand

      puts 'Token release...'

      @token_manager.release processed_command.token

      puts 'done.'

    end

    # puts "CURRENT STATE: #{ @state_manager.to_s }"
    return if command_result.nil?

    puts command_result.to_json

    MessageHandler.instance.send_result JSON.generate command_result.to_json
  end

  # Handle notification from token manager about the new token distribution
  def update player, signature, token
    result = TokenRequestCommandResult.new(@session_id,
                                           player.player_id,
                                           signature,
                                           token).to_json

    puts result

    MessageHandler.instance.send_result JSON.generate result
  end

end