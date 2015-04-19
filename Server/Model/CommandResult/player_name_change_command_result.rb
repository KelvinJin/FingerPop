class PlayerNameChangeCommandResult < CommandResult
  def initialize session_id, player_id, old_name, new_name
    @session_id = session_id
    @player_id = player_id
    @old_name = old_name
    @new_name = new_name
  end
end