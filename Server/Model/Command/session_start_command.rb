class SessionStartCommand < Command
  attr_reader :ip_addr

  def initialize session_id = nil, player_id = nil
    super(session_id, player_id)
  end
end