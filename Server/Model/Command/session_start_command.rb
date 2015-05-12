class SessionStartCommand < Command
  attr_accessor :player_name

  def initialize session_id = nil, player_id = nil, player_name = nil
    super(session_id, player_id)
    @player_name = player_name
  end
end