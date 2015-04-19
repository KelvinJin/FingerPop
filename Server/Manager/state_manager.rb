# Maintain the state of the system
class StateManager
  def initialize player_manager, score_board_manager, word_manager
    @player_manager = player_manager
    @score_board_manager = score_board_manager
    @word_manager = word_manager
  end

  def tick
    # Send the command back on how to update to the current state from the last state.
    # MessageHandler.instance.send_result to_s
  end

  def to_s
    "Player List:" +
        "#{ @player_manager.to_s }\n" +
    "Score Board:\n" +
        "#{ @score_board_manager.to_s }\n" +
    "Current Word:\n"
  end
end