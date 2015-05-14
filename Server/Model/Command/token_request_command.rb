class TokenRequestCommand < Command
  attr_accessor :signature

  def initialize session_id=nil, player_id=nil, signature=nil
    super(session_id, player_id)
    @signature = signature
  end
end