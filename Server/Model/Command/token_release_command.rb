class TokenReleaseCommand < Command
  def initialize session_id, player_id, token
    super(session_id, player_id)
    @token = token
  end
end