class PlayerNameChangeCommand < Command
  attr_accessor :new_name, :old_name

  def initialize session_id = nil, player_id = nil, new_name = nil, old_name = nil
    super(session_id, player_id)
    @new_name = new_name
    @old_name = old_name
  end
end