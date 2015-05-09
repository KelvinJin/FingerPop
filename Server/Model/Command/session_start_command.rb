class SessionStartCommand < Command
  def initialize session_id = nil, player_id = nil
    super(session_id, player_id)
  end
end