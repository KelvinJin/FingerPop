class LetterInsertCommand < Command
  attr_accessor :card_letter


  def initialize session_id = nil, player_id = nil, card_letter = nil
    super(session_id, player_id)
    @card_letter = card_letter
  end
end