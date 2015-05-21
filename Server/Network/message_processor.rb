class MessageProcessor

  @@session_count = 0
  @@processor_count = 0

  def initialize message_queue, command_factory, game_list
    @message_queue = message_queue
    @command_factory = command_factory
    @game_list = game_list
    @processor_id = @@processor_count
    @@processor_count += 1
  end

  def run
    loop do
      # Get the next message from message queue
      message = @message_queue.pop

      puts "I'm processor #{ @processor_id }"

      next if message.length == 0

      # Parse the message into command
      command = @command_factory.make_command message

      # Concurrent part!!!!!
      process_command command unless command.nil?
    end
  end

  def process_command command
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
    (Time.now.to_i.to_s + new_id.to_s).to_i
  end

  def stop
    @thread.kill
  end
end