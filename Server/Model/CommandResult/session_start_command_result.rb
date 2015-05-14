class SessionStartCommandResult < CommandResult
  def initialize session_id, player_list
    @session_id = session_id
    @player_list = player_list
  end
end