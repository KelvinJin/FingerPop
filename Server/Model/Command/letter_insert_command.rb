class LetterInsertCommand < Command
  attr_accessor :card_letter, :slot_id


  def initialize session_id = nil, player_id = nil, card_letter = nil, slot_id = nil
    super(session_id, player_id)
    @card_letter = card_letter
    @slot_id = slot_id
  end
end