class Player
  attr_reader :name, :player_id, :last_update

  def initialize player_id, name
    @player_id = player_id
    @name = name
  end

  def == other_player
    @player_id == other_player.player_id
  end

  def < other_player
    @player_id < other_player.player_id
  end
end