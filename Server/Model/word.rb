class Word

  attr_accessor :word

  def initialize word
    @word = word
    @letter_map = Hash.new
    @letter_size = 0

    count = 0
    word.each_char do |x|

      # Store the index of all characters into separate array.
      @letter_map[x] = [] if @letter_map[x].nil?
      @letter_map[x] << count

      count += 1
    end

    @letter_size = @letter_map.size
  end

  def unsorted
    @word
  end

  def insert_letter letter
    # Return if the current index is already over the length which
    # means that the word is done.
    return if complete? or letter.length > 1

    return is_first?, @letter_map.delete(letter), complete?
  end

  def is_first?
    @letter_size == @letter_map.size
  end

  def complete?
    @letter_map.empty?
  end
end