class ScoreBoardEntry
  attr_reader :last_update, :score, :player

  def initialize player, score = 0
    @player = player
    @score = score
    @last_update = Time.now
  end

  def update_score score
    @score += score
    @last_update = Time.now
  end

  def to_s
    "%20s : %5d" % [@player.name, @score]
  end
end