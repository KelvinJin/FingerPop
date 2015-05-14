class TokenReleaseCommand < Command

  attr_accessor :token

  def initialize session_id=nil, player_id=nil, token=nil
    super(session_id, player_id)
    @token = token
  end
end