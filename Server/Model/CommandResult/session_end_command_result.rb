class SessionEndCommandResult < CommandResult
  def initialize session_id, player_id
    @session_id = session_id
    @player_id = player_id
  end
end