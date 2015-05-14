class TokenRequestCommandResult < CommandResult

  def initialize session_id, player_id, token
    @session_id = session_id
    @player_id = player_id
    @token = token
  end

end