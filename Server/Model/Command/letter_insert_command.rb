class LetterInsertCommand < Command
  attr_accessor :message, :token

  def initialize session_id = nil, player_id = nil, token=nil, message=nil
    super(session_id, player_id)
    @token = token
    @message = message
  end
end