class Player
  attr_reader :name, :ip_addr, :player_id, :last_update

  def initialize player_id, ip_addr, name
    @player_id = player_id
    @ip_addr = ip_addr
    @name = name
  end

  def == other_player
    @player_id == other_player.player_id
  end

  def < other_player
    @player_id < other_player.player_id
  end
end