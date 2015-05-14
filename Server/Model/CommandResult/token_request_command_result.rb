class TokenRequestCommandResult < CommandResult

  def initialize session_id, player_id, signature, token
    @session_id = session_id
    @player_id = player_id
    @signature = signature
    @token = token
  end

end