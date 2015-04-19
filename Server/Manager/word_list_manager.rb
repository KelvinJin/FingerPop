require 'singleton'

class WordListManager
  include Singleton

  def load_word_list word_list_file
    @word_list = File.new(word_list_file).readlines.map { |l| l.chomp }
  end

  def random_words num
    @word_list.sample num
  end

end